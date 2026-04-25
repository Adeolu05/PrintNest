import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  CheckIcon,
  ShieldIcon,
  SparklesIcon,
  TruckIcon,
  ZapIcon,
} from "@/components/ui/icon";

export const metadata = { title: "Pricing" };

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    cadence: "forever",
    description: "Get a sellable storefront live without paying.",
    features: [
      "1 storefront",
      "5 artworks",
      "Basic AI descriptions",
      "WhatsApp checkout",
      "PrintNest subdomain",
    ],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Starter",
    price: "₦2,900",
    cadence: "/month",
    description: "More artworks and AI generations as you grow.",
    features: [
      "50 artworks",
      "200 AI generations / month",
      "All themes",
      "Basic analytics",
      "Remove PrintNest branding",
    ],
    cta: "Go Starter",
    href: "/signup",
    featured: true,
  },
  {
    name: "Pro",
    price: "₦4,900",
    cadence: "/month",
    description: "Sell on a custom domain with payments enabled.",
    features: [
      "Unlimited artworks",
      "Custom domain",
      "Paystack & Flutterwave",
      "Advanced AI captions",
      "SEO tools",
      "Mockups",
    ],
    cta: "Go Pro",
    href: "/signup",
  },
  {
    name: "Studio",
    price: "Talk to us",
    cadence: "",
    description: "Multiple stores, team members and print partners.",
    features: [
      "Multiple stores",
      "Team members",
      "Bulk uploads",
      "Advanced analytics",
      "Print partner integration",
    ],
    cta: "Talk to sales",
    href: "/signup",
  },
];

export default function PricingPage() {
  return (
    <section className="relative isolate">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[480px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-300/30 via-indigo-300/20 to-transparent blur-3xl dark:from-blue-500/20"
      />
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <header className="mx-auto max-w-2xl text-center">
          <Badge tone="info" dot>Simple, transparent pricing</Badge>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
            Built for artists, priced for artists.
          </h1>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300">
            Start free. Upgrade only when your store starts paying for itself. No hidden fees, no setup costs.
          </p>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.featured
                  ? "relative flex flex-col overflow-hidden rounded-3xl border border-blue-500/40 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 text-white shadow-2xl shadow-blue-600/30"
                  : "relative flex flex-col rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              }
            >
              {plan.featured ? (
                <>
                  <div aria-hidden className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                    <ZapIcon size={11} /> Most popular
                  </span>
                </>
              ) : null}
              <p className={plan.featured ? "text-xs font-semibold uppercase tracking-wider opacity-80" : "text-xs font-semibold uppercase tracking-wider text-zinc-500"}>
                {plan.name}
              </p>
              <p className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">{plan.price}</span>
                {plan.cadence ? (
                  <span className={plan.featured ? "text-sm opacity-80" : "text-sm text-zinc-500"}>{plan.cadence}</span>
                ) : null}
              </p>
              <p className={plan.featured ? "mt-2 text-sm opacity-90" : "mt-2 text-sm text-zinc-500"}>{plan.description}</p>
              <ul className={plan.featured ? "mt-5 flex-1 space-y-2.5 text-sm" : "mt-5 flex-1 space-y-2.5 text-sm text-zinc-700 dark:text-zinc-200"}>
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckIcon size={16} className={plan.featured ? "mt-0.5 text-white" : "mt-0.5 text-emerald-500"} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="mt-6">
                <Button variant={plan.featured ? "secondary" : "primary"} fullWidth>
                  {plan.cta}
                  <ArrowRightIcon size={14} />
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-3">
          <TrustItem icon={<ShieldIcon size={18} />} title="Your art stays yours" body="Never used to train models. Files stored privately." />
          <TrustItem icon={<SparklesIcon size={18} />} title="No setup fees" body="No card required to start. Cancel any time." />
          <TrustItem icon={<TruckIcon size={18} />} title="Migrate freely" body="Export artworks and orders to CSV at any time." />
        </div>

        <div className="mt-16 rounded-3xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">Not sure which plan fits?</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Start free. You can upgrade or downgrade anytime — no contract, no migration headache.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/signup"><Button>Start free</Button></Link>
            <Link href="/demo"><Button variant="outline">View live demo</Button></Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="mt-1 text-xs text-zinc-500">{body}</p>
      </div>
    </div>
  );
}
