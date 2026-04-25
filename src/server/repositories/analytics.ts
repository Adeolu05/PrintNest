import "server-only";

import {
  getServiceSupabase,
  hasServerSupabase,
  isMissingTableError,
} from "@/server/supabase";

export async function recordEvent(input: {
  storeId: string;
  artworkId?: string | null;
  eventType: string;
  visitorId?: string | null;
  metadata?: Record<string, unknown>;
}) {
  if (!hasServerSupabase()) return;
  const { error } = await getServiceSupabase()
    .from("store_analytics_events")
    .insert({
      store_id: input.storeId,
      artwork_id: input.artworkId ?? null,
      event_type: input.eventType,
      visitor_id: input.visitorId ?? null,
      metadata: input.metadata ?? null,
    });
  if (error && !isMissingTableError(error)) {
    console.warn("recordEvent failed", error);
  }
}

export async function summariseStore(storeId: string) {
  if (!hasServerSupabase()) {
    return { storeViews: 0, artworkViews: 0, checkoutsStarted: 0 };
  }
  const supabase = getServiceSupabase();
  const counts = await Promise.all(
    ["store_view", "artwork_view", "checkout_started"].map(async (eventType) => {
      const { count, error } = await supabase
        .from("store_analytics_events")
        .select("id", { count: "exact", head: true })
        .eq("store_id", storeId)
        .eq("event_type", eventType);
      if (error) {
        if (isMissingTableError(error)) return 0;
        throw error;
      }
      return count ?? 0;
    }),
  );
  return {
    storeViews: counts[0] ?? 0,
    artworkViews: counts[1] ?? 0,
    checkoutsStarted: counts[2] ?? 0,
  };
}
