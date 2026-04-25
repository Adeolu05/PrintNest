import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { hasServerSupabase } from "./supabase";

const SESSION_COOKIE = "printnest-access-token";

export type SessionUser = {
  id: string;
  email: string;
  fullName?: string | null;
};

/**
 * Resolve the currently signed-in user from the access token cookie.
 *
 * We use Supabase's REST API to validate the JWT instead of `getUser` from a
 * shared client because we want the cookie to be the single source of truth
 * for SSR pages and API routes.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!hasServerSupabase()) return null;
  const store = await cookies();
  const accessToken = store.get(SESSION_COOKIE)?.value;
  if (!accessToken) return null;

  const client = createClient(env.supabase.url, env.supabase.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data, error } = await client.auth.getUser(accessToken);
  if (error || !data?.user) return null;
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    fullName: (data.user.user_metadata?.full_name as string | undefined) ?? null,
  };
}

export async function setSessionCookie(accessToken: string, expiresIn = 60 * 60) {
  const store = await cookies();
  store.set(SESSION_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: expiresIn,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
