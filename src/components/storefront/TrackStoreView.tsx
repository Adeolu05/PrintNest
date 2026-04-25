"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/lib/constants";

/**
 * Fire-and-forget storefront view tracker.
 *
 * Sends a beacon to /api/storefront/event and a PostHog capture.
 * Network failures are swallowed — analytics must never break the page.
 */
export function TrackStoreView({
  storeSlug,
  artworkId,
}: {
  storeSlug: string;
  artworkId?: string | null;
}) {
  useEffect(() => {
    const event = artworkId
      ? ANALYTICS_EVENTS.artworkView
      : ANALYTICS_EVENTS.storeView;
    trackEvent(event, { storeSlug, artworkId });
    fetch("/api/storefront/event", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeSlug,
        artworkId: artworkId ?? null,
        eventType: event,
      }),
    }).catch(() => {});
  }, [storeSlug, artworkId]);
  return null;
}
