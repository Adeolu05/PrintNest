import { NextResponse } from "next/server";
import { storeUpdateSchema } from "@/lib/validators";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import {
  getStoreByUser,
  updateStore,
  type StoreRow,
} from "@/server/repositories/stores";

async function requireOwnedStore(id: string) {
  if (!hasServerSupabase()) return { error: "Supabase not configured", status: 503 } as const;
  const user = await getSessionUser();
  if (!user) return { error: "Not authenticated", status: 401 } as const;
  const store = await getStoreByUser(user.id);
  if (!store || store.id !== id) return { error: "Not found", status: 404 } as const;
  return { store } as const;
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ok = await requireOwnedStore(id);
  if ("error" in ok) return NextResponse.json({ error: ok.error }, { status: ok.status });

  const body = await req.json().catch(() => null);
  const parsed = storeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }
  const patch: Partial<StoreRow> = {};
  const map: Record<string, keyof StoreRow> = {
    storeName: "store_name",
    storeSlug: "store_slug",
    artistName: "artist_name",
    bio: "bio",
    whatsappNumber: "whatsapp_number",
    instagramUrl: "instagram_url",
    tiktokUrl: "tiktok_url",
    xUrl: "x_url",
    country: "country",
    city: "city",
    currency: "currency",
    themeId: "theme_id",
    heroHeadline: "hero_headline",
    heroSubheadline: "hero_subheadline",
    accentColor: "accent_color",
    displayMode: "display_mode",
  };
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === undefined) continue;
    const dbKey = map[k];
    if (dbKey) (patch as Record<string, unknown>)[dbKey] = v;
  }
  const updated = await updateStore(id, patch);
  return NextResponse.json({ store: updated });
}
