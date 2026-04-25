/**
 * One-shot seed script for PrintNest.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY and a fresh schema (see supabase/migrations).
 *
 * Inserts the demo storefront so the landing page demo can also link to a
 * real, published storefront in your environment if you prefer to use the
 * database path instead of the in-memory demo data.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureUser() {
  const email = "demo@printnest.app";
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (existing) return existing.id as string;
  const { data, error } = await supabase
    .from("users")
    .insert({ id: crypto.randomUUID(), email, full_name: "Demo Artist" })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

async function main() {
  const userId = await ensureUser();
  const slug = "tola-prints";
  const { data: existingStore } = await supabase
    .from("stores")
    .select("id")
    .eq("store_slug", slug)
    .maybeSingle();
  let storeId: string;
  if (existingStore) {
    storeId = existingStore.id as string;
  } else {
    const { data, error } = await supabase
      .from("stores")
      .insert({
        user_id: userId,
        store_name: "Tola Adebayo Prints",
        store_slug: slug,
        artist_name: "Tola Adebayo",
        bio: "Lagos-based abstract painter exploring colour, motion, and city memory.",
        theme_id: "minimal-gallery",
        currency: "NGN",
        country: "Nigeria",
        city: "Lagos",
        whatsapp_number: "+2348000000000",
        is_published: true,
      })
      .select("id")
      .single();
    if (error) throw error;
    storeId = data.id as string;
  }

  const artworks = [
    {
      title: "Lagos Ember Flow",
      slug: "lagos-ember-flow",
      short_description:
        "A bold abstract print inspired by the warmth and movement of Lagos at sunset.",
      description:
        "Lagos Ember Flow blends deep blue tones with glowing orange movement, creating a print that feels energetic without overpowering a room.",
      image_url:
        "https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=1600",
      base_price: 25000,
    },
    {
      title: "Quiet Harmattan",
      slug: "quiet-harmattan",
      short_description:
        "A muted palette study of Lagos mornings during the harmattan haze.",
      description:
        "Soft greys and ochres make this print sit calmly on any wall.",
      image_url:
        "https://images.unsplash.com/photo-1549887534-1541e9326642?w=1600",
      base_price: 18000,
    },
  ];

  for (const art of artworks) {
    const { data: existing } = await supabase
      .from("artworks")
      .select("id")
      .eq("store_id", storeId)
      .eq("slug", art.slug)
      .maybeSingle();
    if (existing) continue;
    await supabase.from("artworks").insert({
      ...art,
      store_id: storeId,
      currency: "NGN",
      is_published: true,
    });
  }

  console.log(`Seeded demo store ${slug} (id: ${storeId}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
