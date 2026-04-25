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
      <section id="prints" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-8 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">No prints available right now.</p>
          <p className="mt-1 text-xs text-zinc-500">Check back soon — new editions drop often.</p>
        </div>
      </section>
    );
  }
  return (
    <section id="prints" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Available prints</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
            The collection
          </h2>
        </div>
        <p className="text-xs text-zinc-500">{artworks.length} {artworks.length === 1 ? "print" : "prints"}</p>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {artworks.map((art) => (
          <Link
            key={art.id}
            href={`/s/${store.store_slug}/art/${art.slug}`}
            className="group relative overflow-hidden rounded-2xl bg-zinc-50 transition-all duration-300 hover:-translate-y-1 dark:bg-zinc-900"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.thumbnail_url ?? art.image_url}
                alt={art.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              {art.is_limited_edition ? (
                <div className="absolute left-3 top-3">
                  <Badge tone="brand" size="sm">Limited</Badge>
                </div>
              ) : null}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 px-4 py-3 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur">
                  View print →
                </span>
              </div>
            </div>
            <div className="flex items-start justify-between gap-3 px-1.5 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{art.title}</p>
                {art.short_description ? (
                  <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500">{art.short_description}</p>
                ) : null}
              </div>
              <p className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(Number(art.base_price), art.currency)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
