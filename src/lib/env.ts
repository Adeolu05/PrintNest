function pick(value: string | undefined, fallback = ""): string {
  return value && value.length > 0 ? value : fallback;
}

function pickBool(value: string | undefined, fallback = false): boolean {
  if (!value) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

// NOTE: Next.js only inlines `NEXT_PUBLIC_*` env vars on the client when they
// are accessed by direct property syntax (e.g. `process.env.NEXT_PUBLIC_FOO`).
// Dynamic access like `process.env[key]` will be `undefined` in the browser.
// Keep the references below as direct property accesses.
export const env = {
  appUrl: pick(process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000"),
  appName: pick(process.env.NEXT_PUBLIC_APP_NAME, "PrintNest"),
  demo: {
    authBypass:
      pickBool(process.env.NEXT_PUBLIC_DEMO_AUTH_BYPASS) ||
      pickBool(process.env.DEMO_AUTH_BYPASS) ||
      (process.env.NODE_ENV !== "production" &&
        pickBool(process.env.DEMO_MODE)),
  },
  supabase: {
    url: pick(process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: pick(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleKey: pick(process.env.SUPABASE_SERVICE_ROLE_KEY),
  },
  openai: {
    apiKey: pick(process.env.OPENAI_API_KEY),
    model: pick(process.env.OPENAI_MODEL, "gpt-4o-mini"),
    visionModel: pick(process.env.OPENAI_VISION_MODEL, "gpt-4o-mini"),
  },
  cloudinary: {
    cloudName: pick(process.env.CLOUDINARY_CLOUD_NAME),
    apiKey: pick(process.env.CLOUDINARY_API_KEY),
    apiSecret: pick(process.env.CLOUDINARY_API_SECRET),
  },
  posthog: {
    key: pick(process.env.NEXT_PUBLIC_POSTHOG_KEY),
    host: pick(
      process.env.NEXT_PUBLIC_POSTHOG_HOST,
      "https://app.posthog.com",
    ),
  },
  sentry: {
    dsn: pick(process.env.SENTRY_DSN),
  },
} as const;

export const isSupabaseConfigured = Boolean(
  env.supabase.url && env.supabase.anonKey,
);

export const isOpenAIConfigured = Boolean(env.openai.apiKey);
export const isDemoAuthBypassEnabled = env.demo.authBypass;
