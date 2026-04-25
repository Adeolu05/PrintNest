import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Pricing" };

const PLANS = [
  {
    name: "Free",
    price: "₦0",
    description: "Get a sellable storefront live without paying.",
    features: ["1 storefront", "5 artworks", "Basic AI descriptions", "WhatsApp checkout", "PrintNest subdomain"],
    cta: "Start free",
    href: "/signup",
  },
  {
    name: "Starter",
    price: "₦2,900/mo",
    description: "More artworks and AI generations as you grow.",
    features: ["50 artworks", "200 AI generations / month", "All themes", "Basic analytics"],
    cta: "Go Starter",
    href: "/signup",
    featured: true,
  },
  {
    name: "Pro",
    price: "₦4,900/mo",
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
    price: "Contact us",
    description: "Multiple stores, team members and print partners.",
    features: ["Multiple stores", "Team members", "Bulk uploads", "Advanced analytics", "Print partner integration"],
    cta: "Talk to sales",
    href: "/signup",
  },
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
          Simple pricing for independent artists.
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Start free. Upgrade only when your store starts paying for itself.
        </p>
      </header>
      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.featured
                ? "relative flex flex-col rounded-2xl border border-zinc-900 bg-zinc-900 p-6 text-white shadow-lg dark:border-white"
                : "flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            }
          >
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{plan.name}</p>
            <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
            <p className="mt-2 text-sm opacity-80">{plan.description}</p>
            <ul className="mt-4 flex-1 space-y-2 text-sm opacity-90">
              {plan.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <Link href={plan.href} className="mt-6">
              <Button variant={plan.featured ? "secondary" : "primary"} fullWidth>
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
