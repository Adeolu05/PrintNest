import { NextResponse } from "next/server";
import { z } from "zod";
import { ANALYTICS_EVENTS } from "@/lib/constants";
import { hasServerSupabase } from "@/server/supabase";
import { recordEvent } from "@/server/repositories/analytics";
import { getStoreBySlug } from "@/server/repositories/stores";

const allowedEvents = Object.values(ANALYTICS_EVENTS) as [string, ...string[]];

const schema = z.object({
  storeSlug: z.string().min(1),
  artworkId: z.string().nullable().optional(),
  visitorId: z.string().nullable().optional(),
  eventType: z.enum(allowedEvents),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  if (!hasServerSupabase()) return NextResponse.json({ ok: true, skipped: true });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const store = await getStoreBySlug(parsed.data.storeSlug);
  if (!store) return NextResponse.json({ ok: true, skipped: true });
  await recordEvent({
    storeId: store.id,
    artworkId: parsed.data.artworkId ?? null,
    eventType: parsed.data.eventType,
    visitorId: parsed.data.visitorId ?? null,
    metadata: parsed.data.metadata,
  });
  return NextResponse.json({ ok: true });
}
