import { NextResponse } from "next/server";
import { onboardingSchema } from "@/lib/validators";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { createStore, getStoreByUser, isSlugAvailable } from "@/server/repositories/stores";
import { STORE_THEMES } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (hasServerSupabase() && !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const ownerId = user?.id ?? "local-user";
    const existing = await getStoreByUser(ownerId).catch(() => null);
    if (existing) {
      return NextResponse.json(
        { error: "Store already exists", store: existing },
        { status: 409 },
      );
    }

    const slugFree = await isSlugAvailable(parsed.data.storeSlug).catch(
      () => true,
    );
    if (!slugFree) {
      return NextResponse.json(
        { error: "Store URL is taken" },
        { status: 409 },
      );
    }

    const theme =
      STORE_THEMES.find((t) => t.id === parsed.data.themeId) ?? STORE_THEMES[0];

    const store = await createStore({
      user_id: ownerId,
      store_name: parsed.data.storeName,
      store_slug: parsed.data.storeSlug,
      artist_name: parsed.data.artistName,
      bio: parsed.data.bio || null,
      logo_url: null,
      banner_url: null,
      theme_id: theme.id,
      accent_color: theme.accent,
      display_mode: "gallery",
      hero_headline: null,
      hero_subheadline: null,
      currency: parsed.data.currency,
      country: parsed.data.country,
      city: parsed.data.city || null,
      whatsapp_number: parsed.data.whatsappNumber,
      instagram_url: parsed.data.instagramUrl || null,
      tiktok_url: parsed.data.tiktokUrl || null,
      x_url: parsed.data.xUrl || null,
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/stores] failed", err);
    const message =
      err instanceof Error ? err.message : "Could not create store";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (hasServerSupabase() && !user) return NextResponse.json({ store: null });
    const store = await getStoreByUser(user?.id ?? "local-user").catch(
      () => null,
    );
    return NextResponse.json({ store });
  } catch (err) {
    console.error("[GET /api/stores] failed", err);
    return NextResponse.json({ store: null });
  }
}
