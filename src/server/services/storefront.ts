import "server-only";

import { hasServerSupabase } from "@/server/supabase";
import {
  getArtworkBySlug,
  getArtworkById,
  listArtworksForStore,
  listVariantsForArtwork,
  type ArtworkRow,
  type ArtworkVariantRow,
} from "@/server/repositories/artworks";
import {
  getStoreBySlug,
  type StoreRow,
} from "@/server/repositories/stores";
import { DEMO_ARTWORKS, DEMO_STORE, DEMO_VARIANTS } from "@/server/demo";

export type LoadedStorefront = {
  store: StoreRow;
  artworks: ArtworkRow[];
  isDemo: boolean;
};

export type LoadedArtwork = {
  store: StoreRow;
  artwork: ArtworkRow;
  variants: ArtworkVariantRow[];
  isDemo: boolean;
};

const DEMO_SLUG = DEMO_STORE.store_slug;

/**
 * Load a public storefront by slug. Falls back to demo data if Supabase isn't
 * configured or if the requested slug matches the demo slug — this keeps the
 * landing-page demo working without any database setup.
 */
export async function loadStorefront(slug: string): Promise<LoadedStorefront | null> {
  if (!hasServerSupabase() || slug === DEMO_SLUG) {
    if (slug !== DEMO_SLUG) return null;
    return { store: DEMO_STORE, artworks: DEMO_ARTWORKS, isDemo: true };
  }
  const store = await getStoreBySlug(slug);
  if (!store) return null;
  const artworks = await listArtworksForStore(store.id, { onlyPublished: true });
  return { store, artworks, isDemo: false };
}

export async function loadArtworkPage(
  slug: string,
  artworkSlug: string,
): Promise<LoadedArtwork | null> {
  if (!hasServerSupabase() || slug === DEMO_SLUG) {
    if (slug !== DEMO_SLUG) return null;
    const artwork = DEMO_ARTWORKS.find((a) => a.slug === artworkSlug);
    if (!artwork) return null;
    return {
      store: DEMO_STORE,
      artwork,
      variants: DEMO_VARIANTS[artwork.id] ?? [],
      isDemo: true,
    };
  }
  const store = await getStoreBySlug(slug);
  if (!store) return null;
  const artwork = await getArtworkBySlug(store.id, artworkSlug);
  if (!artwork || !artwork.is_published) return null;
  const variants = await listVariantsForArtwork(artwork.id);
  return { store, artwork, variants, isDemo: false };
}

export async function loadArtworkForCheckout(storeSlug: string, artworkId: string) {
  if (artworkId.startsWith("demo-") || storeSlug === DEMO_SLUG) {
    const artwork = DEMO_ARTWORKS.find((a) => a.id === artworkId);
    if (!artwork) return null;
    return {
      artwork,
      variants: DEMO_VARIANTS[artwork.id] ?? [],
      store: DEMO_STORE,
      isDemo: true,
    };
  }
  const store = await getStoreBySlug(storeSlug);
  if (!store) return null;
  const artwork = await getArtworkById(artworkId);
  if (!artwork || artwork.store_id !== store.id) return null;
  const variants = await listVariantsForArtwork(artwork.id);
  return { artwork, variants, store, isDemo: false };
}
