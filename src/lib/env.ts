function read(key: string, fallback = ""): string {
  const value = process.env[key];
  return value && value.length > 0 ? value : fallback;
}

export const env = {
  appUrl: read("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  appName: read("NEXT_PUBLIC_APP_NAME", "PrintNest"),
  supabase: {
    url: read("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleKey: read("SUPABASE_SERVICE_ROLE_KEY"),
  },
  openai: {
    apiKey: read("OPENAI_API_KEY"),
    model: read("OPENAI_MODEL", "gpt-4o-mini"),
    visionModel: read("OPENAI_VISION_MODEL", "gpt-4o-mini"),
  },
  cloudinary: {
    cloudName: read("CLOUDINARY_CLOUD_NAME"),
    apiKey: read("CLOUDINARY_API_KEY"),
    apiSecret: read("CLOUDINARY_API_SECRET"),
  },
  posthog: {
    key: read("NEXT_PUBLIC_POSTHOG_KEY"),
    host: read("NEXT_PUBLIC_POSTHOG_HOST", "https://app.posthog.com"),
  },
  sentry: {
    dsn: read("SENTRY_DSN"),
  },
} as const;

export const isSupabaseConfigured = Boolean(
  env.supabase.url && env.supabase.anonKey,
);

export const isOpenAIConfigured = Boolean(env.openai.apiKey);
