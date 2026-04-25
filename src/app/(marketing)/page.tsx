import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STORE_THEMES } from "@/lib/constants";
import { DEMO_ARTWORKS, DEMO_STORE } from "@/server/demo";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <DemoGallery />
      <PricingPreview />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              AI print storefront for visual artists
            </span>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-white">
              Turn your artwork into a print store in minutes.
            </h1>
            <p className="max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
              Upload your art, let AI write the descriptions, and launch a beautiful storefront you can share on Instagram, TikTok, WhatsApp, or anywhere your buyers already are.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <Button size="lg">Create my store</Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline">
                  View demo store
                </Button>
              </Link>
            </div>
            <ul className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-500">
              <li>No code</li>
              <li>·</li>
              <li>WhatsApp checkout</li>
              <li>·</li>
              <li>Mobile-first</li>
              <li>·</li>
              <li>Free to start</li>
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
    <div className="relative grid gap-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-3 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:grid-cols-3">
      <PreviewCard label="1. Upload">
        <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-orange-200 via-rose-300 to-amber-200" />
        <p className="mt-3 text-xs text-zinc-500">Drop your artwork. We optimise the file and check print quality automatically.</p>
      </PreviewCard>
      <PreviewCard label="2. AI writes copy">
        <div className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3 text-xs leading-5 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="font-semibold text-zinc-900 dark:text-zinc-100">Lagos Ember Flow</p>
          <p className="text-zinc-600 dark:text-zinc-300">A bold abstract print inspired by the warmth and movement of Lagos at sunset.</p>
          <p className="text-[10px] uppercase tracking-wide text-zinc-400">Tone · Premium</p>
        </div>
        <p className="mt-3 text-xs text-zinc-500">Title, description, captions and SEO — generated and editable.</p>
      </PreviewCard>
      <PreviewCard label="3. Storefront live">
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="aspect-[4/5] rounded-t-xl bg-gradient-to-br from-rose-200 via-orange-200 to-yellow-200" />
          <div className="space-y-1 px-3 py-3 text-xs">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">Lagos Ember Flow</p>
            <p className="text-zinc-500">From ₦18,000</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-zinc-500">Share one link. Receive structured orders.</p>
      </PreviewCard>
    </div>
  );
}

function PreviewCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-zinc-950">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      {children}
    </div>
  );
}

function SocialProof() {
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/60 py-8 dark:border-zinc-900 dark:bg-zinc-950/60">
      <p className="mx-auto max-w-3xl px-4 text-center text-sm text-zinc-600 sm:px-6 dark:text-zinc-300">
        Built for visual artists, illustrators, photographers, and digital creators who want to sell prints without setting up a full ecommerce store.
      </p>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Upload your artwork",
      body: "Drop in one or many images. We check resolution and recommend safe print sizes.",
    },
    {
      title: "AI creates product pages",
      body: "Title, descriptions, SEO, captions and a WhatsApp sales message — all editable.",
    },
    {
      title: "Share and receive orders",
      body: "Send one link. Customers order through WhatsApp. You manage everything from a clean dashboard.",
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">How it works</h2>
      <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
        Three steps from a single image to a sellable storefront. No drag-and-drop builder, no spreadsheets.
      </p>
      <ol className="mt-8 grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Step 0{i + 1}</span>
            <h3 className="mt-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Features() {
  const items = [
    "AI product descriptions",
    "Print size setup",
    "Beautiful storefront",
    "WhatsApp checkout",
    "Order dashboard",
    "Mockup-ready uploads",
    "SEO-ready product pages",
    "Social media captions",
  ];
  return (
    <section className="border-y border-zinc-100 bg-zinc-50/60 py-16 dark:border-zinc-900 dark:bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">What's included</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DemoGallery() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">Demo storefront</h2>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            A live example built with PrintNest's default theme. Browse the artworks, open a product page, or send a sample WhatsApp order.
          </p>
        </div>
        <Link href={`/s/${DEMO_STORE.store_slug}`}>
          <Button variant="outline">Open demo store</Button>
        </Link>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_ARTWORKS.map((art) => (
          <Link
            key={art.id}
            href={`/s/${DEMO_STORE.store_slug}/art/${art.slug}`}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.thumbnail_url ?? art.image_url}
              alt={art.title}
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="px-4 py-3">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{art.title}</p>
              <p className="text-xs text-zinc-500">From ₦{art.base_price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {STORE_THEMES.slice(0, 3).map((theme) => (
          <div key={theme.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Theme</p>
            <p className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">{theme.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{theme.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingPreview() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50/60 py-16 dark:border-zinc-900 dark:bg-zinc-950/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">Start free. Upgrade when you grow.</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <PlanCard
            name="Free"
            price="₦0"
            features={["1 storefront", "5 artworks", "Basic AI descriptions", "WhatsApp checkout", "PrintNest subdomain"]}
            cta="Create my store"
            href="/signup"
          />
          <PlanCard
            name="Pro"
            price="From ₦4,900/mo"
            featured
            features={[
              "Unlimited artworks",
              "Premium themes",
              "Advanced AI captions",
              "Custom domain",
              "Paystack & Flutterwave",
              "Analytics",
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
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={
        featured
          ? "relative rounded-2xl border border-zinc-900 bg-zinc-900 p-6 text-white shadow-lg dark:border-white"
          : "rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{name}</p>
      <p className="mt-2 text-3xl font-semibold">{price}</p>
      <ul className="mt-4 space-y-2 text-sm opacity-90">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>
      <Link href={href} className="mt-6 inline-block">
        <Button variant={featured ? "secondary" : "primary"}>{cta}</Button>
      </Link>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-zinc-900 to-zinc-700 px-8 py-12 text-center text-white shadow-xl dark:border-zinc-800">
        <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight sm:text-3xl">
          You make the art. PrintNest packages it.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-zinc-200">
          Upload your first artwork. Get a sellable storefront before lunch.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Create my store
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
              View demo store
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
