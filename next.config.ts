import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
