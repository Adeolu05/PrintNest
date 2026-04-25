import "server-only";

import {
  getServiceSupabase,
  hasServerSupabase,
  isMissingTableError,
} from "@/server/supabase";
import { slugify } from "@/lib/utils";

export type ArtworkRow = {
  id: string;
  store_id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  ai_description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  image_width: number | null;
  image_height: number | null;
  category: string | null;
  medium: string | null;
  year_created: number | null;
  tags: string[] | null;
  base_price: number;
  currency: string;
  stock_status: string;
  is_limited_edition: boolean;
  edition_size: number | null;
  edition_sold: number;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type ArtworkVariantRow = {
  id: string;
  artwork_id: string;
  size_code: string;
  size_label: string | null;
  frame_option: string;
  price: number;
  stock_quantity: number | null;
  paper_type: string | null;
  created_at: string;
  updated_at: string;
};

export async function listArtworksForStore(storeId: string, opts: { onlyPublished?: boolean } = {}) {
  if (!hasServerSupabase()) return [] as ArtworkRow[];
  let query = getServiceSupabase()
    .from("artworks")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (opts.onlyPublished) query = query.eq("is_published", true);
  const { data, error } = await query;
  if (error) {
    if (isMissingTableError(error)) return [] as ArtworkRow[];
    throw error;
  }
  return (data ?? []) as ArtworkRow[];
}

export async function getArtworkById(id: string) {
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ArtworkRow) ?? null;
}

export async function getArtworkBySlug(storeId: string, slug: string) {
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .select("*")
    .eq("store_id", storeId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as ArtworkRow) ?? null;
}

export async function listVariantsForArtwork(artworkId: string) {
  const { data, error } = await getServiceSupabase()
    .from("artwork_variants")
    .select("*")
    .eq("artwork_id", artworkId)
    .order("price", { ascending: true });
  if (error) throw error;
  return (data ?? []) as ArtworkVariantRow[];
}

export type CreateArtworkInput = Partial<ArtworkRow> & {
  store_id: string;
  title: string;
  image_url: string;
};

/**
 * Create an artwork with a unique slug within the store.
 * If a slug collision happens, append a short suffix.
 */
export async function createArtwork(input: CreateArtworkInput) {
  const baseSlug = slugify(input.slug ?? input.title);
  let slug = baseSlug || `artwork-${Date.now().toString(36)}`;
  for (let i = 0; i < 5; i += 1) {
    const exists = await getArtworkBySlug(input.store_id, slug);
    if (!exists) break;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .insert({ ...input, slug })
    .select("*")
    .single();
  if (error) throw error;
  return data as ArtworkRow;
}

export async function updateArtwork(id: string, patch: Partial<ArtworkRow>) {
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as ArtworkRow;
}

export async function deleteArtwork(id: string) {
  const { error } = await getServiceSupabase()
    .from("artworks")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function replaceVariants(
  artworkId: string,
  variants: Array<Pick<ArtworkVariantRow, "size_code" | "frame_option" | "price"> & { stock_quantity?: number | null }>,
) {
  const supabase = getServiceSupabase();
  const { error: delErr } = await supabase
    .from("artwork_variants")
    .delete()
    .eq("artwork_id", artworkId);
  if (delErr) throw delErr;
  if (variants.length === 0) return [];
  const rows = variants.map((v) => ({
    artwork_id: artworkId,
    size_code: v.size_code,
    frame_option: v.frame_option,
    price: v.price,
    stock_quantity: v.stock_quantity ?? null,
  }));
  const { data, error } = await supabase
    .from("artwork_variants")
    .insert(rows)
    .select("*");
  if (error) throw error;
  return (data ?? []) as ArtworkVariantRow[];
}
