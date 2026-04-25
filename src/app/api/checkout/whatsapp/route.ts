import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validators";
import { hasServerSupabase } from "@/server/supabase";
import { loadArtworkForCheckout } from "@/server/services/storefront";
import {
  createOrder,
  generateOrderNumber,
  upsertCustomer,
} from "@/server/repositories/orders";
import { recordEvent } from "@/server/repositories/analytics";
import { ANALYTICS_EVENTS } from "@/lib/constants";
import { buildWhatsAppLink, buildWhatsAppMessage } from "@/lib/whatsapp";

/**
 * Persist a WhatsApp checkout intent and return a wa.me URL the buyer can
 * open to message the artist.
 *
 * Flow:
 * 1. Validate input (store slug, artwork id, customer details, variant).
 * 2. Look up the artwork + variant + store.
 * 3. Persist customer and order rows so the artist sees the lead in their
 *    dashboard even if WhatsApp drops off.
 * 4. Build a friendly prefilled message and a wa.me URL.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { storeSlug, artworkId, variantId, sizeCode, frameOption, quantity, customer } =
    parsed.data;

  const data = await loadArtworkForCheckout(storeSlug, artworkId);
  if (!data) {
    return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
  }
  const { artwork, store, variants } = data;
  const variant =
    variants.find((v) => v.id === variantId) ??
    variants.find((v) => v.size_code === sizeCode && v.frame_option === frameOption) ??
    null;
  const unitPrice = variant ? Number(variant.price) : Number(artwork.base_price);
  const total = unitPrice * quantity;
  const orderNumber = generateOrderNumber();

  const message = buildWhatsAppMessage({
    storeName: store.store_name,
    artistName: store.artist_name,
    artworkTitle: artwork.title,
    size: variant?.size_label ?? variant?.size_code ?? sizeCode ?? null,
    frame: variant?.frame_option ?? frameOption ?? null,
    quantity,
    unitPrice,
    currency: artwork.currency,
    customerName: customer.name,
    customerAddress: customer.deliveryAddress,
    customerNote: customer.note,
    orderNumber,
  });

  const whatsappUrl = buildWhatsAppLink(store.whatsapp_number, message);

  // For demo storefronts (no DB persistence), short-circuit to the wa.me link
  // so the experience still works end-to-end.
  if (data.isDemo || !hasServerSupabase()) {
    return NextResponse.json({
      orderNumber,
      whatsappUrl,
      total,
      currency: artwork.currency,
      persisted: false,
    });
  }

  try {
    const customerRow = await upsertCustomer({
      store_id: store.id,
      name: customer.name,
      email: customer.email || null,
      phone: customer.phone,
      address: customer.deliveryAddress,
    });

    await createOrder({
      store_id: store.id,
      customer_id: customerRow.id,
      order_number: orderNumber,
      total_amount: total,
      currency: artwork.currency,
      payment_method: "whatsapp",
      delivery_address: customer.deliveryAddress,
      customer_note: customer.note ?? null,
      whatsapp_message: message,
      items: [
        {
          artwork_id: artwork.id,
          variant_id: variant?.id ?? null,
          title_snapshot: artwork.title,
          size_snapshot: variant?.size_label ?? variant?.size_code ?? null,
          frame_snapshot: variant?.frame_option ?? null,
          price_snapshot: unitPrice,
          quantity,
        },
      ],
    });

    await recordEvent({
      storeId: store.id,
      artworkId: artwork.id,
      eventType: ANALYTICS_EVENTS.orderCreated,
      metadata: { orderNumber },
    });
  } catch (err) {
    console.error("Could not persist checkout order", err);
  }

  return NextResponse.json({
    orderNumber,
    whatsappUrl,
    total,
    currency: artwork.currency,
    persisted: true,
  });
}
