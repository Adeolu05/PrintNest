import "server-only";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getServiceSupabase,
  hasServerSupabase,
  isMissingTableError,
  isSchemaError,
} from "@/server/supabase";

export type StoreRow = {
  id: string;
  user_id: string;
  store_name: string;
  store_slug: string;
  artist_name: string;
  bio: string | null;
  logo_url: string | null;
  banner_url: string | null;
  theme_id: string;
  accent_color: string | null;
  display_mode: string;
  hero_headline: string | null;
  hero_subheadline: string | null;
  currency: string;
  country: string | null;
  city: string | null;
  whatsapp_number: string;
  instagram_url: string | null;
  tiktok_url: string | null;
  x_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

function client(): SupabaseClient {
  return getServiceSupabase();
}

const LOCAL_STORE_COOKIE = "printnest-local-store";

async function readLocalStore(): Promise<StoreRow | null> {
  const jar = await cookies();
  const raw = jar.get(LOCAL_STORE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoreRow;
    return parsed && parsed.id ? parsed : null;
  } catch {
    return null;
  }
}

async function writeLocalStore(store: StoreRow) {
  const jar = await cookies();
  jar.set(LOCAL_STORE_COOKIE, JSON.stringify(store), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

function makeLocalStore(input: CreateStoreInput): StoreRow {
  const now = new Date().toISOString();
  return {
    id: "local-store",
    user_id: input.user_id || "local-user",
    store_name: input.store_name,
    store_slug: input.store_slug,
    artist_name: input.artist_name,
    bio: input.bio ?? null,
    logo_url: input.logo_url ?? null,
    banner_url: input.banner_url ?? null,
    theme_id: input.theme_id,
    accent_color: input.accent_color ?? null,
    display_mode: input.display_mode,
    hero_headline: input.hero_headline ?? null,
    hero_subheadline: input.hero_subheadline ?? null,
    currency: input.currency,
    country: input.country ?? null,
    city: input.city ?? null,
    whatsapp_number: input.whatsapp_number,
    instagram_url: input.instagram_url ?? null,
    tiktok_url: input.tiktok_url ?? null,
    x_url: input.x_url ?? null,
    is_published: Boolean(input.is_published),
    created_at: now,
    updated_at: now,
  };
}

async function getLocalStoreBySlug(slug: string): Promise<StoreRow | null> {
  const local = await readLocalStore();
  if (!local || !local.is_published) return null;
  return local.store_slug === slug ? local : null;
}

async function getLocalStoreByUser(userId: string): Promise<StoreRow | null> {
  const local = await readLocalStore();
  if (!local) return null;
  return local.user_id === userId || userId === "local-user" ? local : null;
}

async function isLocalSlugAvailable(slug: string): Promise<boolean> {
  const local = await readLocalStore();
  return !local || local.store_slug !== slug;
}

async function createLocalStore(input: CreateStoreInput): Promise<StoreRow> {
  const local = makeLocalStore(input);
  await writeLocalStore(local);
  return local;
}

async function updateLocalStore(
  id: string,
  patch: Partial<StoreRow>,
): Promise<StoreRow> {
  const current = await readLocalStore();
  if (!current || current.id !== id) {
    throw new Error("Store not found");
  }
  const updated: StoreRow = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  await writeLocalStore(updated);
  return updated;
}

export async function getStoreBySlug(slug: string): Promise<StoreRow | null> {
  if (!hasServerSupabase()) return getLocalStoreBySlug(slug);
  const { data, error } = await client()
    .from("stores")
    .select("*")
    .eq("store_slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return null;
    if (isSchemaError(error)) return getLocalStoreBySlug(slug);
    throw error;
  }
  return (data as StoreRow) ?? null;
}

export async function getStoreByUser(userId: string): Promise<StoreRow | null> {
  if (!hasServerSupabase()) return getLocalStoreByUser(userId);
  const { data, error } = await client()
    .from("stores")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return getLocalStoreByUser(userId);
    if (isSchemaError(error)) return getLocalStoreByUser(userId);
    throw error;
  }
  return (data as StoreRow) ?? null;
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  if (!hasServerSupabase()) return isLocalSlugAvailable(slug);
  const { data, error } = await client()
    .from("stores")
    .select("id")
    .eq("store_slug", slug)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return true;
    if (isSchemaError(error)) return isLocalSlugAvailable(slug);
    throw error;
  }
  return !data;
}

export type CreateStoreInput = Omit<StoreRow, "id" | "created_at" | "updated_at" | "is_published"> & {
  is_published?: boolean;
};

export async function createStore(input: CreateStoreInput): Promise<StoreRow> {
  if (!hasServerSupabase()) return createLocalStore(input);
  const { data, error } = await client()
    .from("stores")
    .insert(input)
    .select("*")
    .single();
  if (error) {
    // If the live schema is missing tables/columns we expect (e.g. PGRST204
    // "Could not find the 'accent_color' column ... in the schema cache"),
    // fall back to the cookie-backed local store so onboarding still works.
    if (isSchemaError(error)) {
      console.warn(
        "[stores.createStore] Supabase schema mismatch, falling back to local store:",
        (error as { message?: string }).message,
      );
      return createLocalStore(input);
    }
    throw error;
  }
  return data as StoreRow;
}

export async function updateStore(
  id: string,
  patch: Partial<StoreRow>,
): Promise<StoreRow> {
  if (!hasServerSupabase()) return updateLocalStore(id, patch);
  const { data, error } = await client()
    .from("stores")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) {
    if (isSchemaError(error)) {
      console.warn(
        "[stores.updateStore] Supabase schema mismatch, falling back to local store:",
        (error as { message?: string }).message,
      );
      return updateLocalStore(id, patch);
    }
    throw error;
  }
  return data as StoreRow;
}

export async function publishStore(id: string, publish = true) {
  return updateStore(id, { is_published: publish });
}
