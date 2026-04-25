import Link from "next/link";
import type { ArtworkRow } from "@/server/repositories/artworks";
import type { StoreRow } from "@/server/repositories/stores";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ArtworkGrid({
  store,
  artworks,
}: {
  store: StoreRow;
  artworks: ArtworkRow[];
}) {
  if (artworks.length === 0) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <p className="text-sm text-zinc-500">
          No prints available right now. Check back soon.
        </p>
      </section>
    );
  }
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-white">
        Available prints
      </h2>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((art) => (
          <Link
            key={art.id}
            href={`/s/${store.store_slug}/art/${art.slug}`}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.thumbnail_url ?? art.image_url}
              alt={art.title}
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="space-y-1 px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-white">
                  {art.title}
                </p>
                {art.is_limited_edition ? <Badge tone="info">Limited</Badge> : null}
              </div>
              {art.short_description ? (
                <p className="line-clamp-2 text-xs text-zinc-500">
                  {art.short_description}
                </p>
              ) : null}
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                From {formatCurrency(Number(art.base_price), art.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
