import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this project. Without this, when the
  // parent folder contains many sibling Node projects, Next.js can infer the
  // wrong workspace root and CSS `@import "tailwindcss"` fails to resolve
  // (which then makes route handlers return empty responses in dev).
  turbopack: {
    root: __dirname,
  },
  // Same fix for the production build/SSR tracing.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Allow Supabase storage public URLs across regions/projects.
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  typedRoutes: false,
};

export default nextConfig;
