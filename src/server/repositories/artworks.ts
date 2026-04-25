import "server-only";

import { cookies } from "next/headers";
import {
  getServiceSupabase,
  hasServerSupabase,
  isMissingTableError,
  isSchemaError,
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

// ---------------------------------------------------------------------------
// Local cookie-backed fallback
//
// Used when Supabase isn't configured OR when the live schema is out of date
// (PGRST204/PGRST205 etc.). Keeps the demo / onboarding flow usable on Vercel
// even when migrations haven't been applied to the remote database.
// ---------------------------------------------------------------------------

const LOCAL_ARTWORKS_COOKIE = "printnest-local-artworks";
const LOCAL_VARIANTS_COOKIE = "printnest-local-variants";
const MAX_LOCAL_ARTWORKS = 24;

async function readLocalArtworks(): Promise<ArtworkRow[]> {
  const jar = await cookies();
  const raw = jar.get(LOCAL_ARTWORKS_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ArtworkRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalArtworks(rows: ArtworkRow[]) {
  const jar = await cookies();
  // Trim to most recent N to keep the cookie under browser limits (~4KB).
  // Image URLs from Supabase storage / Cloudinary are short; data URLs are
  // not, so we count those out of an oldest-first cap.
  const trimmed = rows.slice(-MAX_LOCAL_ARTWORKS);
  jar.set(LOCAL_ARTWORKS_COOKIE, JSON.stringify(trimmed), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

async function readLocalVariants(): Promise<ArtworkVariantRow[]> {
  const jar = await cookies();
  const raw = jar.get(LOCAL_VARIANTS_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ArtworkVariantRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalVariants(rows: ArtworkVariantRow[]) {
  const jar = await cookies();
  jar.set(LOCAL_VARIANTS_COOKIE, JSON.stringify(rows), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function makeLocalArtwork(input: CreateArtworkInput, slug: string): ArtworkRow {
  const now = new Date().toISOString();
  return {
    id: `local-art-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`,
    store_id: input.store_id,
    title: input.title,
    slug,
    short_description: input.short_description ?? null,
    description: input.description ?? null,
    ai_description: input.ai_description ?? null,
    image_url: input.image_url,
    thumbnail_url: input.thumbnail_url ?? null,
    image_width: input.image_width ?? null,
    image_height: input.image_height ?? null,
    category: input.category ?? null,
    medium: input.medium ?? null,
    year_created: input.year_created ?? null,
    tags: input.tags ?? [],
    base_price: input.base_price ?? 0,
    currency: input.currency ?? "NGN",
    stock_status: input.stock_status ?? "in_stock",
    is_limited_edition: input.is_limited_edition ?? false,
    edition_size: input.edition_size ?? null,
    edition_sold: input.edition_sold ?? 0,
    is_published: input.is_published ?? false,
    view_count: 0,
    created_at: now,
    updated_at: now,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function listArtworksForStore(
  storeId: string,
  opts: { onlyPublished?: boolean } = {},
) {
  if (!hasServerSupabase()) {
    const all = await readLocalArtworks();
    return all
      .filter((a) => a.store_id === storeId)
      .filter((a) => (opts.onlyPublished ? a.is_published : true))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  }
  let query = getServiceSupabase()
    .from("artworks")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (opts.onlyPublished) query = query.eq("is_published", true);
  const { data, error } = await query;
  if (error) {
    if (isMissingTableError(error) || isSchemaError(error)) {
      const all = await readLocalArtworks();
      return all
        .filter((a) => a.store_id === storeId)
        .filter((a) => (opts.onlyPublished ? a.is_published : true))
        .sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
    }
    throw error;
  }
  return (data ?? []) as ArtworkRow[];
}

export async function getArtworkById(id: string) {
  if (!hasServerSupabase()) {
    const all = await readLocalArtworks();
    return all.find((a) => a.id === id) ?? null;
  }
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    if (isSchemaError(error)) {
      const all = await readLocalArtworks();
      return all.find((a) => a.id === id) ?? null;
    }
    throw error;
  }
  return (data as ArtworkRow) ?? null;
}

export async function getArtworkBySlug(storeId: string, slug: string) {
  if (!hasServerSupabase()) {
    const all = await readLocalArtworks();
    return all.find((a) => a.store_id === storeId && a.slug === slug) ?? null;
  }
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .select("*")
    .eq("store_id", storeId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    if (isSchemaError(error)) {
      const all = await readLocalArtworks();
      return all.find((a) => a.store_id === storeId && a.slug === slug) ?? null;
    }
    throw error;
  }
  return (data as ArtworkRow) ?? null;
}

export async function listVariantsForArtwork(artworkId: string) {
  if (!hasServerSupabase()) {
    const all = await readLocalVariants();
    return all
      .filter((v) => v.artwork_id === artworkId)
      .sort((a, b) => (a.price < b.price ? -1 : 1));
  }
  const { data, error } = await getServiceSupabase()
    .from("artwork_variants")
    .select("*")
    .eq("artwork_id", artworkId)
    .order("price", { ascending: true });
  if (error) {
    if (isSchemaError(error)) {
      const all = await readLocalVariants();
      return all
        .filter((v) => v.artwork_id === artworkId)
        .sort((a, b) => (a.price < b.price ? -1 : 1));
    }
    throw error;
  }
  return (data ?? []) as ArtworkVariantRow[];
}

export type CreateArtworkInput = Partial<ArtworkRow> & {
  store_id: string;
  title: string;
  image_url: string;
};

async function findUniqueLocalSlug(
  storeId: string,
  baseSlug: string,
): Promise<string> {
  let slug = baseSlug || `artwork-${Date.now().toString(36)}`;
  for (let i = 0; i < 5; i += 1) {
    const exists = await getArtworkBySlug(storeId, slug);
    if (!exists) return slug;
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
  }
  return slug;
}

async function createLocalArtwork(input: CreateArtworkInput): Promise<ArtworkRow> {
  const baseSlug = slugify(input.slug ?? input.title);
  const slug = await findUniqueLocalSlug(input.store_id, baseSlug);
  const row = makeLocalArtwork(input, slug);
  const all = await readLocalArtworks();
  await writeLocalArtworks([...all, row]);
  return row;
}

/**
 * Create an artwork with a unique slug within the store.
 * If a slug collision happens, append a short suffix.
 */
export async function createArtwork(input: CreateArtworkInput) {
  if (!hasServerSupabase()) return createLocalArtwork(input);

  const baseSlug = slugify(input.slug ?? input.title);
  let slug = baseSlug || `artwork-${Date.now().toString(36)}`;
  try {
    for (let i = 0; i < 5; i += 1) {
      const exists = await getArtworkBySlug(input.store_id, slug);
      if (!exists) break;
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
    }
  } catch {
    // Slug uniqueness check fell over — keep going, the insert below will
    // either succeed or fall back to local.
  }

  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .insert({ ...input, slug })
    .select("*")
    .single();
  if (error) {
    if (isSchemaError(error)) {
      console.warn(
        "[artworks.createArtwork] Supabase schema mismatch, falling back to local store:",
        (error as { message?: string }).message,
      );
      return createLocalArtwork(input);
    }
    throw error;
  }
  return data as ArtworkRow;
}

async function updateLocalArtwork(
  id: string,
  patch: Partial<ArtworkRow>,
): Promise<ArtworkRow> {
  const all = await readLocalArtworks();
  const idx = all.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Artwork not found");
  const updated: ArtworkRow = {
    ...all[idx],
    ...patch,
    updated_at: new Date().toISOString(),
  };
  all[idx] = updated;
  await writeLocalArtworks(all);
  return updated;
}

export async function updateArtwork(id: string, patch: Partial<ArtworkRow>) {
  if (!hasServerSupabase()) return updateLocalArtwork(id, patch);
  const { data, error } = await getServiceSupabase()
    .from("artworks")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    if (isSchemaError(error)) {
      console.warn(
        "[artworks.updateArtwork] Supabase schema mismatch, falling back to local store:",
        (error as { message?: string }).message,
      );
      return updateLocalArtwork(id, patch);
    }
    throw error;
  }
  return data as ArtworkRow;
}

async function deleteLocalArtwork(id: string) {
  const all = await readLocalArtworks();
  await writeLocalArtworks(all.filter((a) => a.id !== id));
  const variants = await readLocalVariants();
  await writeLocalVariants(variants.filter((v) => v.artwork_id !== id));
}

export async function deleteArtwork(id: string) {
  if (!hasServerSupabase()) return deleteLocalArtwork(id);
  const { error } = await getServiceSupabase()
    .from("artworks")
    .delete()
    .eq("id", id);
  if (error) {
    if (isSchemaError(error)) return deleteLocalArtwork(id);
    throw error;
  }
}

async function replaceLocalVariants(
  artworkId: string,
  variants: Array<
    Pick<ArtworkVariantRow, "size_code" | "frame_option" | "price"> & {
      stock_quantity?: number | null;
    }
  >,
): Promise<ArtworkVariantRow[]> {
  const all = await readLocalVariants();
  const remaining = all.filter((v) => v.artwork_id !== artworkId);
  const now = new Date().toISOString();
  const fresh: ArtworkVariantRow[] = variants.map((v) => ({
    id: `local-var-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`,
    artwork_id: artworkId,
    size_code: v.size_code,
    size_label: null,
    frame_option: v.frame_option,
    price: v.price,
    stock_quantity: v.stock_quantity ?? null,
    paper_type: null,
    created_at: now,
    updated_at: now,
  }));
  await writeLocalVariants([...remaining, ...fresh]);
  return fresh;
}

export async function replaceVariants(
  artworkId: string,
  variants: Array<
    Pick<ArtworkVariantRow, "size_code" | "frame_option" | "price"> & {
      stock_quantity?: number | null;
    }
  >,
) {
  if (!hasServerSupabase()) return replaceLocalVariants(artworkId, variants);
  const supabase = getServiceSupabase();
  const { error: delErr } = await supabase
    .from("artwork_variants")
    .delete()
    .eq("artwork_id", artworkId);
  if (delErr) {
    if (isSchemaError(delErr)) return replaceLocalVariants(artworkId, variants);
    throw delErr;
  }
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
  if (error) {
    if (isSchemaError(error)) return replaceLocalVariants(artworkId, variants);
    throw error;
  }
  return (data ?? []) as ArtworkVariantRow[];
}
