import { notFound, redirect } from "next/navigation";
import { ArtworkForm } from "@/components/dashboard/ArtworkForm";
import { PageHeader } from "@/components/ui/section";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { getArtworkById, listVariantsForArtwork } from "@/server/repositories/artworks";
import { hasServerSupabase } from "@/server/supabase";

export const metadata = { title: "Edit artwork" };

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");

  const store = user ? await getStoreByUser(user.id).catch(() => null) : null;
  if (!store) redirect("/dashboard/onboarding");

  const artwork = await getArtworkById(id);
  if (!artwork || artwork.store_id !== store.id) notFound();

  const variants = await listVariantsForArtwork(artwork.id);

  return (
    <div>
      <PageHeader title={artwork.title} description="Update copy, pricing, or publish status." />
      <ArtworkForm
        storeCurrency={store.currency}
        initial={{
          id: artwork.id,
          title: artwork.title,
          slug: artwork.slug,
          shortDescription: artwork.short_description ?? "",
          description: artwork.description ?? "",
          category: artwork.category ?? undefined,
          medium: artwork.medium ?? "",
          yearCreated: artwork.year_created,
          tags: artwork.tags ?? [],
          basePrice: Number(artwork.base_price),
          currency: artwork.currency,
          isLimitedEdition: artwork.is_limited_edition,
          editionSize: artwork.edition_size,
          imageUrl: artwork.image_url,
          imageWidth: artwork.image_width,
          imageHeight: artwork.image_height,
          isPublished: artwork.is_published,
          variants: variants.map((v) => ({
            id: v.id,
            sizeCode: v.size_code,
            frameOption: v.frame_option,
            price: Number(v.price),
            stockQuantity: v.stock_quantity,
          })),
        }}
      />
    </div>
  );
}
