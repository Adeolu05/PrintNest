import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser } from "@/server/repositories/stores";
import {
  createArtwork,
  listArtworksForStore,
  replaceVariants,
} from "@/server/repositories/artworks";
import { artworkSchema } from "@/lib/validators";

const incomingSchema = artworkSchema.extend({
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        sizeCode: z.string(),
        frameOption: z.string(),
        price: z.number().nonnegative(),
        stockQuantity: z.number().int().nonnegative().nullable().optional(),
      }),
    )
    .max(20)
    .optional(),
  aiCaption: z.string().max(320).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
  altText: z.string().max(160).optional(),
  whatsappMessage: z.string().max(600).optional(),
});

export async function GET() {
  if (!hasServerSupabase()) return NextResponse.json({ artworks: [] });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const store = await getStoreByUser(user.id);
  if (!store) return NextResponse.json({ artworks: [] });
  const artworks = await listArtworksForStore(store.id);
  return NextResponse.json({ artworks });
}

export async function POST(req: Request) {
  if (!hasServerSupabase()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const store = await getStoreByUser(user.id);
  if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = incomingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const artwork = await createArtwork({
    store_id: store.id,
    title: parsed.data.title,
    slug: parsed.data.slug,
    short_description: parsed.data.shortDescription || null,
    description: parsed.data.description || null,
    ai_description: parsed.data.aiCaption || null,
    image_url: parsed.data.imageUrl,
    thumbnail_url: parsed.data.thumbnailUrl || null,
    image_width: parsed.data.imageWidth ?? null,
    image_height: parsed.data.imageHeight ?? null,
    category: parsed.data.category || null,
    medium: parsed.data.medium || null,
    year_created: parsed.data.yearCreated ?? null,
    tags: parsed.data.tags ?? [],
    base_price: parsed.data.basePrice,
    currency: parsed.data.currency,
    is_limited_edition: parsed.data.isLimitedEdition ?? false,
    edition_size: parsed.data.editionSize ?? null,
    is_published: parsed.data.isPublished ?? false,
  });

  if (parsed.data.variants?.length) {
    await replaceVariants(
      artwork.id,
      parsed.data.variants.map((v) => ({
        size_code: v.sizeCode,
        frame_option: v.frameOption,
        price: v.price,
        stock_quantity: v.stockQuantity ?? null,
      })),
    );
  }

  return NextResponse.json({ artwork }, { status: 201 });
}
