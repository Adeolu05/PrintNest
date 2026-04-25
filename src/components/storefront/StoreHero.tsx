import type { StoreRow } from "@/server/repositories/stores";
import {
  ExternalLinkIcon,
  GlobeIcon,
  InstagramIcon,
  TikTokIcon,
  XSocialIcon,
} from "@/components/ui/icon";

export function StoreHero({ store }: { store: StoreRow }) {
  const headline =
    store.hero_headline ||
    `Original prints by ${store.artist_name}`;
  const subheadline =
    store.hero_subheadline ||
    store.bio ||
    "High-quality wall prints for homes, studios, and creative spaces.";

  return (
    <section className="relative isolate overflow-hidden border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      {store.banner_url ? (
        <div className="absolute inset-0 -z-10 opacity-30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={store.banner_url} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white dark:from-zinc-950/0 dark:via-zinc-950/60 dark:to-zinc-950" />
        </div>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/30 via-indigo-200/25 to-transparent blur-3xl dark:from-blue-500/15 dark:via-indigo-600/15"
        />
      )}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {store.city ? `${store.city} · ` : ""}{store.country ?? "Independent artist"}
        </div>
        <h1 className="mt-3 max-w-3xl text-[40px] font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-[56px] dark:text-white">
          {headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
          {subheadline}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#prints"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Browse prints
          </a>
          <SocialLinks store={store} />
        </div>
      </div>
    </section>
  );
}

function SocialLinks({ store }: { store: StoreRow }) {
  type SocialLink = { label: string; href: string; icon: React.ReactNode };
  const links: SocialLink[] = [];
  if (store.instagram_url) links.push({ label: "Instagram", href: store.instagram_url, icon: <InstagramIcon size={14} /> });
  if (store.tiktok_url) links.push({ label: "TikTok", href: store.tiktok_url, icon: <TikTokIcon size={14} /> });
  if (store.x_url) links.push({ label: "X", href: store.x_url, icon: <XSocialIcon size={14} /> });
  if (links.length === 0) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2">
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-700 backdrop-blur transition-colors hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {link.icon}
            {link.label}
            <ExternalLinkIcon size={11} className="text-zinc-400" />
          </a>
        </li>
      ))}
      <li className="hidden items-center gap-1.5 text-xs text-zinc-400 sm:inline-flex">
        <GlobeIcon size={12} />
        Ships worldwide
      </li>
    </ul>
  );
}
