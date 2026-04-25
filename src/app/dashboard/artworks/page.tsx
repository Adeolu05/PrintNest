import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageHeader, EmptyState } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { listArtworksForStore } from "@/server/repositories/artworks";
import { hasServerSupabase } from "@/server/supabase";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Artworks" };

export default async function ArtworksPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");

  const ownerId = user?.id ?? "local-user";
  const store = await getStoreByUser(ownerId).catch(() => null);
  if (!store) {
    return (
      <div>
        <PageHeader title="Artworks" />
        <EmptyState
          title="Set up your storefront first"
          description="You'll be able to upload artworks once your store is created."
          action={
            <Link href="/dashboard/onboarding">
              <Button>Start onboarding</Button>
            </Link>
          }
        />
      </div>
    );
  }
  const artworks = await listArtworksForStore(store.id).catch(() => []);

  return (
    <div>
      <PageHeader
        title="Artworks"
        description="Upload, edit, and publish your prints."
        actions={
          <Link href="/dashboard/artworks/new">
            <Button>Upload artwork</Button>
          </Link>
        }
      />
      {artworks.length === 0 ? (
        <EmptyState
          title="No artworks yet"
          description="Upload your first piece. We'll generate a draft product page and price suggestion."
          action={
            <Link href="/dashboard/artworks/new">
              <Button>Upload your first artwork</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => (
            <Link
              key={art.id}
              href={`/dashboard/artworks/${art.id}/edit`}
              className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.thumbnail_url ?? art.image_url}
                alt={art.title}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="space-y-1 px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-white">{art.title}</p>
                  <Badge tone={art.is_published ? "success" : "warning"}>
                    {art.is_published ? "Live" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500">From {formatCurrency(Number(art.base_price), art.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
