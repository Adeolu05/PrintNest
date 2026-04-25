import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  GlobeIcon,
  HeartIcon,
  PaletteIcon,
  PlayIcon,
  ShieldIcon,
  SparklesIcon,
  StarIcon,
  StoreIcon,
  TrendingUpIcon,
  TruckIcon,
  UploadIcon,
  WhatsAppIcon,
  ZapIcon,
} from "@/components/ui/icon";
import { STORE_THEMES } from "@/lib/constants";
import { DEMO_ARTWORKS, DEMO_STORE } from "@/server/demo";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <LogoStrip />
      <HowItWorks />
      <AiInAction />
      <Features />
      <DemoGallery />
      <Stats />
      <Testimonials />
      <PricingPreview />
      <Faq />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-300/40 via-indigo-300/30 to-transparent blur-3xl dark:from-blue-500/25 dark:via-indigo-600/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-32 -z-10 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl dark:bg-blue-500/20"
      />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="space-y-6 animate-fade-in-up">
            <Link
              href="/#whats-new"
              className="group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-blue-700 shadow-sm backdrop-blur transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200"
            >
              <SparklesIcon size={12} />
              <span>New · AI Studio for Instagram + SEO captions</span>
              <ArrowRightIcon size={12} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <h1 className="text-[44px] font-semibold leading-[1.02] tracking-tight text-zinc-900 sm:text-[56px] md:text-[64px] dark:text-white">
              Turn your artwork into a{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  print store
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1 left-0 h-2 w-full text-blue-500/60"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C 50 2, 150 14, 198 4"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br className="hidden sm:block" /> in minutes.
            </h1>
            <p className="max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
              Upload your art, let AI write the descriptions, and launch a beautiful storefront you can share on Instagram, TikTok, WhatsApp, or anywhere your buyers already are.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <Button size="lg">
                  Create my store
                  <ArrowRightIcon size={16} />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  <PlayIcon size={14} />
                  View live demo
                </Button>
              </Link>
            </div>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
              <li className="inline-flex items-center gap-1.5"><CheckIcon size={14} className="text-emerald-500" /> No code</li>
              <li className="inline-flex items-center gap-1.5"><CheckIcon size={14} className="text-emerald-500" /> WhatsApp checkout</li>
              <li className="inline-flex items-center gap-1.5"><CheckIcon size={14} className="text-emerald-500" /> Mobile-first</li>
              <li className="inline-flex items-center gap-1.5"><CheckIcon size={14} className="text-emerald-500" /> Free to start</li>
            </ul>
          </div>
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-blue-200/60 via-indigo-200/40 to-transparent blur-2xl dark:from-blue-700/30 dark:via-indigo-700/20"
      />
      <div className="rounded-[1.75rem] border border-zinc-200/70 bg-white/70 p-2 shadow-2xl shadow-blue-500/10 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="overflow-hidden rounded-[1.4rem] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[11px] text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-800">
              <ShieldIcon size={11} />
              printnest.app/s/<span className="text-zinc-900 dark:text-zinc-100">tola-prints</span>
            </div>
          </div>

          {/* Store header */}
          <div className="border-b border-zinc-100 px-5 pb-4 pt-5 dark:border-zinc-900">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Lagos · Nigeria</p>
            <p className="mt-1 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Tola Adebayo Prints</p>
          </div>

          {/* Mini grid */}
          <div className="grid grid-cols-3 gap-2 p-3">
            {DEMO_ARTWORKS.slice(0, 3).map((art, i) => (
              <div
                key={art.id}
                className="overflow-hidden rounded-xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                style={{ animation: `float 5s ease-in-out ${i * 0.4}s infinite` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art.thumbnail_url ?? art.image_url}
                  alt={art.title}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="space-y-0.5 px-2 py-2">
                  <p className="line-clamp-1 text-[11px] font-semibold text-zinc-900 dark:text-zinc-100">{art.title}</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-300">From ₦{art.base_price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating AI card */}
      <div className="absolute -bottom-6 -left-4 hidden w-64 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl shadow-blue-500/10 sm:-left-8 sm:block dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <SparklesIcon size={14} />
          </span>
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">AI is writing copy…</p>
        </div>
        <div className="mt-2.5 space-y-1.5">
          <div className="h-2 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2 w-5/6 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-2 w-3/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Floating stats card */}
      <div className="absolute -top-6 -right-3 hidden w-52 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl shadow-blue-500/10 md:block dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Today</p>
          <Badge tone="success" dot size="sm">Live</Badge>
        </div>
        <p className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">₦128,500</p>
        <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
          <TrendingUpIcon size={11} /> +24% vs yesterday
        </p>
      </div>
    </div>
  );
}

function LogoStrip() {
  const items = [
    "Lagos Studio",
    "Nairobi Atelier",
    "Accra Frames",
    "Kingston Print",
    "Cape Editions",
    "Casablanca Press",
  ];
  return (
    <section className="border-y border-zinc-100 bg-white py-8 dark:border-zinc-900 dark:bg-zinc-950">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
        Trusted by independent artists & studios across 20+ cities
      </p>
      <div className="mt-6 grid grid-cols-2 items-center gap-6 px-4 sm:grid-cols-3 md:grid-cols-6">
        {items.map((label) => (
          <div
            key={label}
            className="text-center font-serif text-base italic tracking-tight text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-300"
          >
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <UploadIcon size={20} />,
      title: "Upload your artwork",
      body: "Drop in one or many images. We check resolution and recommend safe print sizes automatically.",
    },
    {
      icon: <SparklesIcon size={20} />,
      title: "AI writes the copy",
      body: "Title, descriptions, SEO, captions and a WhatsApp sales message — all editable in one place.",
    },
    {
      icon: <StoreIcon size={20} />,
      title: "Share & receive orders",
      body: "Send one link. Customers order through WhatsApp. You manage everything from a clean dashboard.",
    },
  ];
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">How it works</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          From a single image to a sellable storefront.
        </h2>
        <p className="mt-3 text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
          Three steps. No drag-and-drop builder, no spreadsheets, no theme code. Open on your phone, share the link.
        </p>
      </div>
      <ol className="mt-10 grid gap-4 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/40"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/15 to-indigo-500/0 transition-opacity group-hover:opacity-100"
            />
            <div className="flex items-center justify-between">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
                {step.icon}
              </span>
              <span className="font-mono text-xs font-medium text-zinc-300 dark:text-zinc-700">0{i + 1}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
            <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-300">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AiInAction() {
  return (
    <section className="relative overflow-hidden border-y border-zinc-100 bg-gradient-to-b from-zinc-50 to-white py-20 dark:border-zinc-900 dark:from-zinc-950 dark:to-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <Badge tone="info" dot>AI Studio</Badge>
            <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              From blank stare to <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">sellable</span> in 30 seconds.
            </h2>
            <p className="mt-3 max-w-lg text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
              Pick a tone — Premium, Poetic, Minimal, Luxury, African Contemporary — and PrintNest writes a full product page, an Instagram caption, and a SEO meta description in your voice.
            </p>
            <ul className="mt-6 grid gap-2.5 text-sm text-zinc-700 dark:text-zinc-200">
              {[
                "Title, short description and full description",
                "Instagram & TikTok caption with hashtags",
                "SEO title + meta description",
                "WhatsApp sales message ready to copy",
              ].map((line) => (
                <li key={line} className="flex items-start gap-2">
                  <CheckCircleIcon size={18} className="mt-0.5 text-emerald-500" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <BeforeCard />
            <AfterCard />
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeCard() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Before</p>
      <p className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">Untitled-final-2.jpg</p>
      <p className="mt-2 text-xs text-zinc-500">Description: …</p>
      <div className="mt-4 space-y-1.5">
        <div className="h-2 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-2 w-2/3 rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>
      <p className="mt-5 text-xs text-zinc-400">No price. No SEO. Hard to share.</p>
    </div>
  );
}

function AfterCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm dark:border-blue-500/30 dark:from-zinc-950 dark:to-blue-950/30">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-300">After · Premium tone</p>
        <Badge tone="brand" size="sm">AI</Badge>
      </div>
      <p className="mt-3 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Lagos Ember Flow</p>
      <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-300">
        A bold abstract print inspired by the warmth and movement of Lagos at sunset — deep blues meet glowing ember tones, designed to anchor a living room or studio.
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Tag>From ₦18,000</Tag>
        <Tag>A4 · A3 · A2</Tag>
        <Tag>+7 captions</Tag>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-white/60 px-2 py-1.5 text-center text-[11px] font-medium text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
      {children}
    </div>
  );
}

function Features() {
  const items = [
    {
      icon: <SparklesIcon size={18} />,
      title: "AI product copy",
      body: "Titles, descriptions, captions, SEO. Pick a tone and edit in place.",
    },
    {
      icon: <PaletteIcon size={18} />,
      title: "Beautiful themes",
      body: "Minimal, gallery, dark, bold. Every theme is mobile-first and fast.",
    },
    {
      icon: <UploadIcon size={18} />,
      title: "Smart uploads",
      body: "Resolution checks, safe size suggestions, automatic image optimisation.",
    },
    {
      icon: <WhatsAppIcon size={18} />,
      title: "WhatsApp checkout",
      body: "One-tap order with size, quantity, address & note prefilled.",
    },
    {
      icon: <StoreIcon size={18} />,
      title: "Storefront in a link",
      body: "A shareable URL that looks great in IG bio, WhatsApp status, anywhere.",
    },
    {
      icon: <TrendingUpIcon size={18} />,
      title: "Order dashboard",
      body: "Track orders, statuses, payments and revenue from one screen.",
    },
    {
      icon: <ShieldIcon size={18} />,
      title: "Limited editions",
      body: "Set edition sizes and PrintNest tracks remaining numbers automatically.",
    },
    {
      icon: <GlobeIcon size={18} />,
      title: "Custom domain",
      body: "Bring your own domain on Pro. Beautifully on-brand.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Features</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Everything an artist needs. Nothing they don&apos;t.
        </h2>
        <p className="mt-3 text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
          PrintNest replaces theme builders, copywriters, link-in-bio tools, and order spreadsheets with one focused workspace.
        </p>
      </div>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li
            key={item.title}
            className="group rounded-2xl border border-zinc-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/40"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300">
              {item.icon}
            </span>
            <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DemoGallery() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50/60 py-20 dark:border-zinc-900 dark:bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Live demo</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Demo storefront, built with PrintNest.
            </h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
              Browse the artworks, open a product page, or test the WhatsApp checkout flow — no signup needed.
            </p>
          </div>
          <Link href={`/s/${DEMO_STORE.store_slug}`}>
            <Button variant="outline">
              Open demo store
              <ArrowRightIcon size={14} />
            </Button>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_ARTWORKS.map((art) => (
            <Link
              key={art.id}
              href={`/s/${DEMO_STORE.store_slug}/art/${art.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.thumbnail_url ?? art.image_url}
                alt={art.title}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/55 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 translate-y-2 px-4 py-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold">{art.title}</p>
                <p className="text-xs opacity-90">From ₦{art.base_price.toLocaleString()} · {art.category}</p>
              </div>
              <div className="space-y-1 px-4 py-3 transition-opacity duration-300 group-hover:opacity-0">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{art.title}</p>
                <p className="text-xs text-blue-600 dark:text-blue-300">From ₦{art.base_price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {STORE_THEMES.slice(0, 3).map((theme) => (
            <div
              key={theme.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Theme</p>
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ background: theme.accent }}
                />
              </div>
              <p className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">{theme.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{theme.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "<10 min", label: "Average time from signup to live store" },
    { value: "8x", label: "Faster than building a Shopify store" },
    { value: "0", label: "Code or theme files to manage" },
    { value: "20+", label: "Cities using PrintNest today" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-3 rounded-3xl border border-zinc-200 bg-white p-2 sm:grid-cols-2 lg:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-950">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-zinc-50/70 p-6 text-center transition-colors hover:bg-blue-50/60 dark:bg-zinc-900/50 dark:hover:bg-blue-500/10"
          >
            <p className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              {s.value}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "I uploaded eight pieces over breakfast. By lunch I had a live store, an Instagram caption I actually liked, and my first WhatsApp order.",
      name: "Tola Adebayo",
      role: "Painter · Lagos",
      avatar: "TA",
    },
    {
      quote:
        "PrintNest replaced three tools for me — Linktree, my notes app where I drafted captions, and a half-built Shopify store I never finished.",
      name: "Amani Otieno",
      role: "Illustrator · Nairobi",
      avatar: "AO",
    },
    {
      quote:
        "The AI tone presets are the killer feature. ‘Premium’ for serious buyers, ‘Instagram-friendly’ for stories. It just works.",
      name: "Kojo Mensah",
      role: "Photographer · Accra",
      avatar: "KM",
    },
  ];
  return (
    <section className="border-y border-zinc-100 bg-white py-20 dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Loved by artists</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Built for the way artists actually sell.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-zinc-50/60 p-6 transition-colors hover:border-blue-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-blue-500/40 dark:hover:bg-zinc-950"
            >
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} size={14} className="fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
                  {t.avatar}
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.name}</p>
                  <p className="text-xs text-zinc-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="bg-zinc-50/60 py-20 dark:bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Pricing</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            Start free. Upgrade only when you grow.
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
            Every plan includes the storefront, AI copy, and WhatsApp checkout. Pay only when your store starts paying for itself.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <PlanCard
            name="Free"
            price="₦0"
            tagline="For your first sellable storefront."
            features={["1 storefront", "5 artworks", "Basic AI descriptions", "WhatsApp checkout", "PrintNest subdomain"]}
            cta="Create my store"
            href="/signup"
          />
          <PlanCard
            name="Pro"
            price="From ₦4,900/mo"
            tagline="For artists who are scaling sales."
            featured
            features={[
              "Unlimited artworks",
              "Premium themes",
              "Advanced AI captions",
              "Custom domain",
              "Paystack & Flutterwave",
              "Analytics dashboard",
            ]}
            cta="See full pricing"
            href="/pricing"
          />
        </div>
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  features,
  cta,
  href,
  featured,
  tagline,
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  tagline?: string;
}) {
  return (
    <div
      className={
        featured
          ? "relative overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-7 text-white shadow-2xl shadow-blue-600/30"
          : "relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-950"
      }
    >
      {featured ? (
        <>
          <div aria-hidden className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            <ZapIcon size={11} /> Most popular
          </span>
        </>
      ) : null}
      <p className={featured ? "text-xs font-semibold uppercase tracking-wider opacity-80" : "text-xs font-semibold uppercase tracking-wider text-zinc-500"}>
        {name}
      </p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{price}</p>
      {tagline ? (
        <p className={featured ? "mt-1 text-sm opacity-90" : "mt-1 text-sm text-zinc-500"}>{tagline}</p>
      ) : null}
      <ul className={featured ? "mt-5 space-y-2.5 text-sm" : "mt-5 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-200"}>
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckIcon size={16} className={featured ? "mt-0.5 text-white" : "mt-0.5 text-emerald-500"} />
            {f}
          </li>
        ))}
      </ul>
      <Link href={href} className="mt-7 inline-block">
        <Button variant={featured ? "secondary" : "primary"}>
          {cta}
          <ArrowRightIcon size={14} />
        </Button>
      </Link>
    </div>
  );
}

function Faq() {
  const qa = [
    {
      q: "Do I need any design or coding skills?",
      a: "No. PrintNest writes your product pages, picks safe print sizes, and gives you a live storefront URL. You just upload your art.",
    },
    {
      q: "How does WhatsApp checkout actually work?",
      a: "When a buyer fills the order form, we generate a structured WhatsApp message and open chat with your number. The order is also saved in your dashboard automatically.",
    },
    {
      q: "Can I use my own domain?",
      a: "Yes — custom domains are included on Pro. We also include a free PrintNest subdomain on the Free plan so you can ship today.",
    },
    {
      q: "Who prints and ships the artwork?",
      a: "You do, for now. The MVP is built around artists who already print and ship locally. Print-on-demand integrations (Printful, Gelato) are on the roadmap.",
    },
    {
      q: "Is my artwork safe?",
      a: "Yes. Files are stored privately in Supabase, served from a CDN, and never used to train AI models.",
    },
    {
      q: "What happens to my store if I cancel?",
      a: "Your data is yours. You can export artworks and orders at any time. Free plan keeps the storefront online with PrintNest branding.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">FAQ</p>
        <h2 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Questions, answered.
        </h2>
      </div>
      <div className="mt-10 divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
        {qa.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-900/60">
              <span>{item.q}</span>
              <ChevronDownIcon
                size={18}
                className="text-zinc-400 transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-zinc-100 px-5 py-4 text-sm leading-6 text-zinc-600 dark:border-zinc-900 dark:text-zinc-300">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-500/30 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 px-6 py-16 text-center text-white shadow-2xl shadow-blue-600/30 sm:px-10 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-[0.18]" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
            <HeartIcon size={12} /> Built with love for visual artists
          </span>
          <h2 className="mt-5 mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
            You make the art. <br className="hidden sm:block" /> PrintNest packages it.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
            Upload your first artwork. Get a sellable storefront before lunch.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-700 shadow-xl shadow-black/10 hover:bg-blue-50">
                Create my store
                <ArrowRightIcon size={16} />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <PlayIcon size={14} />
                Watch demo
              </Button>
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-blue-100">
            <li className="inline-flex items-center gap-1.5"><TruckIcon size={14} /> Mobile-first by default</li>
            <li className="inline-flex items-center gap-1.5"><ShieldIcon size={14} /> Your art stays yours</li>
            <li className="inline-flex items-center gap-1.5"><GlobeIcon size={14} /> Sell anywhere</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
