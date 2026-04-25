"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { env } from "@/lib/env";

let initialised = false;

/**
 * Initialise PostHog on the client when a key is present.
 * Wrapping in a provider keeps initialisation in one place and avoids running
 * it during SSR / static generation.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (initialised) return;
    if (!env.posthog.key) return;
    posthog.init(env.posthog.key, {
      api_host: env.posthog.host,
      capture_pageview: true,
      autocapture: false,
      person_profiles: "always",
    });
    initialised = true;
  }, []);
  return <>{children}</>;
}

export function trackEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!env.posthog.key) return;
  posthog.capture(event, props);
}
