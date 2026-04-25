import { NextResponse } from "next/server";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser, isSlugAvailable } from "@/server/repositories/stores";
import { slugify } from "@/lib/utils";
import { DEMO_STORE } from "@/server/demo";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("slug") ?? "";
  const slug = slugify(raw);
  if (!slug || slug.length < 2) {
    return NextResponse.json({ available: false, reason: "too_short" });
  }
  if (slug === DEMO_STORE.store_slug) {
    return NextResponse.json({ available: false, reason: "reserved" });
  }
  if (!hasServerSupabase()) {
    const local = await getStoreByUser("local-user");
    const available = !local || local.store_slug !== slug;
    return NextResponse.json({ available, slug, reason: "local_mode" });
  }
  const available = await isSlugAvailable(slug);
  return NextResponse.json({ available, slug });
}
