import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/storefront/ProductDetail";
import { TrackStoreView } from "@/components/storefront/TrackStoreView";
import { loadArtworkPage } from "@/server/services/storefront";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string; artworkSlug: string }>;
}): Promise<Metadata> {
  const { storeSlug, artworkSlug } = await params;
  const data = await loadArtworkPage(storeSlug, artworkSlug);
  if (!data) return { title: "Artwork not found" };
  const { artwork, store } = data;
  return {
    title: `${artwork.title} · ${store.store_name}`,
    description: artwork.short_description ?? store.bio ?? `Buy a print of ${artwork.title}.`,
    openGraph: {
      title: artwork.title,
      description: artwork.short_description ?? undefined,
      images: [artwork.image_url],
    },
  };
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ storeSlug: string; artworkSlug: string }>;
}) {
  const { storeSlug, artworkSlug } = await params;
  const data = await loadArtworkPage(storeSlug, artworkSlug);
  if (!data) notFound();

  return (
    <>
      <TrackStoreView storeSlug={data.store.store_slug} artworkId={data.artwork.id} />
      <ProductDetail store={data.store} artwork={data.artwork} variants={data.variants} />
    </>
  );
}
