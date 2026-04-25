import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser } from "@/server/repositories/stores";
import {
  deleteArtwork,
  getArtworkById,
  replaceVariants,
  updateArtwork,
  type ArtworkRow,
} from "@/server/repositories/artworks";
import { artworkSchema } from "@/lib/validators";
import { z } from "zod";

const patchSchema = artworkSchema.partial().extend({
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

async function ensureOwned(id: string) {
  if (!hasServerSupabase()) return { error: "Supabase not configured", status: 503 } as const;
  const user = await getSessionUser();
  if (!user) return { error: "Not authenticated", status: 401 } as const;
  const artwork = await getArtworkById(id);
  if (!artwork) return { error: "Not found", status: 404 } as const;
  const store = await getStoreByUser(user.id);
  if (!store || store.id !== artwork.store_id) return { error: "Not found", status: 404 } as const;
  return { artwork, store } as const;
}

export async function GET(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = await ensureOwned(id);
  if ("error" in ok) return NextResponse.json({ error: ok.error }, { status: ok.status });
  return NextResponse.json({ artwork: ok.artwork });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = await ensureOwned(id);
  if ("error" in ok) return NextResponse.json({ error: ok.error }, { status: ok.status });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const patch: Partial<ArtworkRow> = {};
  const data = parsed.data;
  if (data.title !== undefined) patch.title = data.title;
  if (data.slug !== undefined) patch.slug = data.slug;
  if (data.shortDescription !== undefined) patch.short_description = data.shortDescription || null;
  if (data.description !== undefined) patch.description = data.description || null;
  if (data.category !== undefined) patch.category = data.category || null;
  if (data.medium !== undefined) patch.medium = data.medium || null;
  if (data.yearCreated !== undefined) patch.year_created = data.yearCreated ?? null;
  if (data.tags !== undefined) patch.tags = data.tags;
  if (data.basePrice !== undefined) patch.base_price = data.basePrice;
  if (data.currency !== undefined) patch.currency = data.currency;
  if (data.isLimitedEdition !== undefined) patch.is_limited_edition = data.isLimitedEdition;
  if (data.editionSize !== undefined) patch.edition_size = data.editionSize ?? null;
  if (data.imageUrl !== undefined) patch.image_url = data.imageUrl;
  if (data.thumbnailUrl !== undefined) patch.thumbnail_url = data.thumbnailUrl || null;
  if (data.imageWidth !== undefined) patch.image_width = data.imageWidth ?? null;
  if (data.imageHeight !== undefined) patch.image_height = data.imageHeight ?? null;
  if (data.isPublished !== undefined) patch.is_published = data.isPublished;
  if (data.aiCaption !== undefined) patch.ai_description = data.aiCaption || null;

  const artwork = await updateArtwork(id, patch);
  if (data.variants) {
    await replaceVariants(
      artwork.id,
      data.variants.map((v) => ({
        size_code: v.sizeCode,
        frame_option: v.frameOption,
        price: v.price,
        stock_quantity: v.stockQuantity ?? null,
      })),
    );
  }
  return NextResponse.json({ artwork });
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = await ensureOwned(id);
  if ("error" in ok) return NextResponse.json({ error: ok.error }, { status: ok.status });
  await deleteArtwork(id);
  return NextResponse.json({ ok: true });
}
