import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreHero } from "@/components/storefront/StoreHero";
import { ArtworkGrid } from "@/components/storefront/ArtworkGrid";
import { loadStorefront } from "@/server/services/storefront";
import { TrackStoreView } from "@/components/storefront/TrackStoreView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}): Promise<Metadata> {
  const { storeSlug } = await params;
  const data = await loadStorefront(storeSlug);
  if (!data) return { title: "Storefront not found" };
  return {
    title: data.store.store_name,
    description:
      data.store.bio ?? `Buy original prints by ${data.store.artist_name}.`,
    openGraph: {
      title: data.store.store_name,
      description:
        data.store.bio ?? `Buy original prints by ${data.store.artist_name}.`,
      images: data.store.banner_url ? [data.store.banner_url] : undefined,
    },
  };
}

export default async function StorefrontPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const data = await loadStorefront(storeSlug);
  if (!data) notFound();

  return (
    <>
      <TrackStoreView storeSlug={data.store.store_slug} />
      <StoreHero store={data.store} />
      <ArtworkGrid store={data.store} artworks={data.artworks} />
    </>
  );
}
