import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getServiceSupabase,
  hasServerSupabase,
  isMissingTableError,
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

export async function getStoreBySlug(slug: string): Promise<StoreRow | null> {
  if (!hasServerSupabase()) return null;
  const { data, error } = await client()
    .from("stores")
    .select("*")
    .eq("store_slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
  return (data as StoreRow) ?? null;
}

export async function getStoreByUser(userId: string): Promise<StoreRow | null> {
  if (!hasServerSupabase()) return null;
  const { data, error } = await client()
    .from("stores")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
  return (data as StoreRow) ?? null;
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  if (!hasServerSupabase()) return true;
  const { data, error } = await client()
    .from("stores")
    .select("id")
    .eq("store_slug", slug)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return true;
    throw error;
  }
  return !data;
}

export type CreateStoreInput = Omit<StoreRow, "id" | "created_at" | "updated_at" | "is_published"> & {
  is_published?: boolean;
};

export async function createStore(input: CreateStoreInput): Promise<StoreRow> {
  const { data, error } = await client()
    .from("stores")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as StoreRow;
}

export async function updateStore(
  id: string,
  patch: Partial<StoreRow>,
): Promise<StoreRow> {
  const { data, error } = await client()
    .from("stores")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as StoreRow;
}

export async function publishStore(id: string, publish = true) {
  return updateStore(id, { is_published: publish });
}
