import "server-only";

import type { ArtworkRow, ArtworkVariantRow } from "@/server/repositories/artworks";
import type { StoreRow } from "@/server/repositories/stores";

/**
 * Hard-coded demo storefront. Used by:
 * - The landing page "View demo" button.
 * - Storefront pages when Supabase is not configured locally.
 *
 * The data shape mirrors the database row types so the same components can
 * render either real or demo content.
 */
export const DEMO_STORE: StoreRow = {
  id: "demo-store",
  user_id: "demo-user",
  store_name: "Tola Adebayo Prints",
  store_slug: "tola-prints",
  artist_name: "Tola Adebayo",
  bio: "Lagos-based abstract painter exploring colour, motion, and city memory.",
  logo_url: null,
  banner_url: null,
  theme_id: "minimal-gallery",
  accent_color: "#111111",
  display_mode: "gallery",
  hero_headline: "Original prints for expressive spaces",
  hero_subheadline:
    "Discover artwork by Tola Adebayo, available as high-quality wall prints for homes, studios, and creative spaces.",
  currency: "NGN",
  country: "Nigeria",
  city: "Lagos",
  whatsapp_number: "+2348000000000",
  instagram_url: "https://instagram.com/example",
  tiktok_url: null,
  x_url: null,
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const DEMO_ARTWORKS: ArtworkRow[] = [
  {
    id: "demo-art-1",
    store_id: DEMO_STORE.id,
    title: "Lagos Ember Flow",
    slug: "lagos-ember-flow",
    short_description:
      "A bold abstract print inspired by the warmth and movement of Lagos at sunset.",
    description:
      "Lagos Ember Flow blends deep blue tones with glowing orange movement, creating a print that feels energetic without overpowering a room. It works beautifully in living rooms, studios, and modern bedrooms.",
    ai_description: null,
    image_url:
      "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=1600",
    thumbnail_url:
      "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=600",
    image_width: 4000,
    image_height: 5000,
    category: "Abstract",
    medium: "Digital",
    year_created: 2025,
    tags: ["abstract", "lagos", "wall art", "modern decor"],
    base_price: 25000,
    currency: "NGN",
    stock_status: "in_stock",
    is_limited_edition: false,
    edition_size: null,
    edition_sold: 0,
    is_published: true,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-art-2",
    store_id: DEMO_STORE.id,
    title: "Quiet Harmattan",
    slug: "quiet-harmattan",
    short_description:
      "A muted palette study of Lagos mornings during the harmattan haze.",
    description:
      "Soft greys and ochres make this print sit calmly on any wall. It pairs well with reading corners, bedrooms, and minimalist hallways.",
    ai_description: null,
    image_url:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=1600",
    thumbnail_url:
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=600",
    image_width: 3600,
    image_height: 4800,
    category: "Minimalist",
    medium: "Mixed media",
    year_created: 2024,
    tags: ["minimal", "calm", "neutral", "wall art"],
    base_price: 18000,
    currency: "NGN",
    stock_status: "in_stock",
    is_limited_edition: false,
    edition_size: null,
    edition_sold: 0,
    is_published: true,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-art-3",
    store_id: DEMO_STORE.id,
    title: "Market Geometry",
    slug: "market-geometry",
    short_description:
      "A graphic study of Balogun market — colour, signage, and movement.",
    description:
      "Bold blocks of colour layered with hand-drawn line work. A statement piece for studios and creative offices.",
    ai_description: null,
    image_url:
      "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=1600",
    thumbnail_url:
      "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=600",
    image_width: 4200,
    image_height: 5200,
    category: "Pop",
    medium: "Digital",
    year_created: 2025,
    tags: ["pop", "lagos", "graphic", "bold"],
    base_price: 30000,
    currency: "NGN",
    stock_status: "in_stock",
    is_limited_edition: true,
    edition_size: 25,
    edition_sold: 3,
    is_published: true,
    view_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const DEMO_VARIANTS: Record<string, ArtworkVariantRow[]> = {
  "demo-art-1": [
    {
      id: "demo-variant-1a",
      artwork_id: "demo-art-1",
      size_code: "A4",
      size_label: "A4 (210 × 297 mm)",
      frame_option: "No frame",
      price: 18000,
      stock_quantity: null,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-variant-1b",
      artwork_id: "demo-art-1",
      size_code: "A3",
      size_label: "A3 (297 × 420 mm)",
      frame_option: "Black frame",
      price: 25000,
      stock_quantity: null,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-variant-1c",
      artwork_id: "demo-art-1",
      size_code: "A2",
      size_label: "A2 (420 × 594 mm)",
      frame_option: "Black frame",
      price: 42000,
      stock_quantity: null,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  "demo-art-2": [
    {
      id: "demo-variant-2a",
      artwork_id: "demo-art-2",
      size_code: "A4",
      size_label: "A4 (210 × 297 mm)",
      frame_option: "No frame",
      price: 14000,
      stock_quantity: null,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-variant-2b",
      artwork_id: "demo-art-2",
      size_code: "A3",
      size_label: "A3 (297 × 420 mm)",
      frame_option: "Natural wood",
      price: 18000,
      stock_quantity: null,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  "demo-art-3": [
    {
      id: "demo-variant-3a",
      artwork_id: "demo-art-3",
      size_code: "A3",
      size_label: "A3 (297 × 420 mm)",
      frame_option: "Black frame",
      price: 30000,
      stock_quantity: 22,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-variant-3b",
      artwork_id: "demo-art-3",
      size_code: "A2",
      size_label: "A2 (420 × 594 mm)",
      frame_option: "Walnut frame",
      price: 55000,
      stock_quantity: 22,
      paper_type: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
};
