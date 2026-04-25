import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

let serviceClient: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service role key.
 *
 * Always use this from API routes that run on the server. Never expose the
 * service role key or this client to the browser bundle.
 */
export function getServiceSupabase(): SupabaseClient {
  if (!isSupabaseConfigured || !env.supabase.serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  if (serviceClient) return serviceClient;
  serviceClient = createClient(env.supabase.url, env.supabase.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return serviceClient;
}

/**
 * Returns true if the server has enough credentials to talk to Supabase.
 * Useful for gracefully disabling features in local dev when env vars are
 * missing without crashing the whole app.
 */
export function hasServerSupabase() {
  return Boolean(
    env.supabase.url &&
      env.supabase.anonKey &&
      env.supabase.serviceRoleKey,
  );
}
