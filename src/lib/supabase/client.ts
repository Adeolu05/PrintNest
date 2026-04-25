"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

let cached: SupabaseClient | null = null;

export function getBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (cached) return cached;
  cached = createClient(env.supabase.url, env.supabase.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return cached;
}
