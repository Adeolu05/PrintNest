import type { StoreRow } from "@/server/repositories/stores";

export function StoreHero({ store }: { store: StoreRow }) {
  const headline =
    store.hero_headline ||
    `Original prints by ${store.artist_name}`;
  const subheadline =
    store.hero_subheadline ||
    store.bio ||
    "High-quality wall prints for homes, studios, and creative spaces.";

  return (
    <section className="border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {store.city ? `${store.city} · ` : ""}{store.country ?? "Independent artist"}
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl md:text-5xl dark:text-white">
          {headline}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
          {subheadline}
        </p>
        <SocialLinks store={store} />
      </div>
    </section>
  );
}

function SocialLinks({ store }: { store: StoreRow }) {
  const links = [
    store.instagram_url ? { label: "Instagram", href: store.instagram_url } : null,
    store.tiktok_url ? { label: "TikTok", href: store.tiktok_url } : null,
    store.x_url ? { label: "X", href: store.x_url } : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;
  if (links.length === 0) return null;
  return (
    <ul className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-500">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 py-1 hover:border-zinc-300 dark:border-zinc-800"
          >
            {link.label} <span aria-hidden>↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
