import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, EmptyState } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  ImageIcon,
  PackageIcon,
  PlusIcon,
  SparklesIcon,
  StoreIcon,
  TrendingUpIcon,
  WhatsAppIcon,
  ZapIcon,
} from "@/components/ui/icon";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { listArtworksForStore } from "@/server/repositories/artworks";
import { listOrdersForStore } from "@/server/repositories/orders";
import { summariseStore } from "@/server/repositories/analytics";
import { formatCurrency, formatDate } from "@/lib/utils";
import { hasServerSupabase } from "@/server/supabase";

export default async function DashboardHome() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");

  const ownerId = user?.id ?? "local-user";
  const store = await getStoreByUser(ownerId).catch(() => null);

  if (!store) {
    return (
      <div>
        <PageHeader
          eyebrow="Get started"
          title="Welcome to PrintNest"
          description="Set up your storefront in a few minutes."
        />
        <EmptyState
          icon={<StoreIcon size={22} />}
          title="Create your storefront"
          description="Tell us your artist name, WhatsApp number, and where you sell from. We'll generate your store URL automatically."
          action={
            <Link href="/dashboard/onboarding">
              <Button>
                Start onboarding
                <ArrowRightIcon size={14} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const [artworks, orders, stats] = await Promise.all([
    listArtworksForStore(store.id).catch(() => []),
    listOrdersForStore(store.id).catch(() => []),
    summariseStore(store.id).catch(() => ({ storeViews: 0, artworkViews: 0, checkoutsStarted: 0 })),
  ]);

  const pendingOrders = orders.filter((o) => o.order_status === "new" || o.order_status === "confirmed");
  const revenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((acc, o) => acc + Number(o.total_amount), 0);

  return (
    <div>
      <PageHeader
        eyebrow={store.is_published ? "Live storefront" : "Draft storefront"}
        title={`Hello${user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}`}
        description={`${store.store_name} · printnest.app/s/${store.store_slug}`}
        actions={
          <>
            <Link href={`/s/${store.store_slug}`} target="_blank">
              <Button variant="outline">
                Preview store
                <ExternalLinkIcon size={14} />
              </Button>
            </Link>
            <Link href="/dashboard/artworks/new">
              <Button>
                <PlusIcon size={14} />
                Upload artwork
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<ImageIcon size={16} />}
          label="Total artworks"
          value={String(artworks.length)}
          accent="from-blue-500 to-indigo-600"
        />
        <StatCard
          icon={<PackageIcon size={16} />}
          label="Total orders"
          value={String(orders.length)}
          accent="from-emerald-500 to-teal-600"
          trend={orders.length > 0 ? "+" + orders.length + " this period" : undefined}
        />
        <StatCard
          icon={<WhatsAppIcon size={16} />}
          label="Pending orders"
          value={String(pendingOrders.length)}
          accent="from-amber-500 to-orange-600"
        />
        <StatCard
          icon={<TrendingUpIcon size={16} />}
          label="Revenue (paid)"
          value={formatCurrency(revenue, store.currency)}
          accent="from-fuchsia-500 to-pink-600"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent orders</CardTitle>
              <Link
                href="/dashboard/orders"
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                View all <ArrowRightIcon size={12} />
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {orders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                  <PackageIcon size={20} />
                </span>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">No orders yet</p>
                <p className="max-w-sm text-xs text-zinc-500">
                  Share your store link on Instagram, WhatsApp, or anywhere your buyers are.
                </p>
                <Link href={`/s/${store.store_slug}`} target="_blank" className="mt-1">
                  <Button variant="outline" size="sm">Open store</Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {orders.slice(0, 6).map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-700 dark:bg-blue-500/15 dark:text-blue-200">
                        {order.order_number.slice(-2)}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="block truncate font-medium text-zinc-900 hover:text-blue-700 hover:underline dark:text-white dark:hover:text-blue-200"
                        >
                          {order.order_number}
                        </Link>
                        <p className="text-xs text-zinc-500">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge tone={order.payment_status === "paid" ? "success" : "warning"} dot>
                        {order.payment_status}
                      </Badge>
                      <span className="hidden text-xs font-semibold text-zinc-700 sm:inline dark:text-zinc-200">
                        {formatCurrency(Number(order.total_amount), order.currency)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Storefront traffic</CardTitle>
              <Badge tone="info" size="sm">7 days</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-2.5">
            <Stat label="Store views" value={stats.storeViews} icon={<StoreIcon size={14} />} />
            <Stat label="Artwork views" value={stats.artworkViews} icon={<ImageIcon size={14} />} />
            <Stat label="Checkouts started" value={stats.checkoutsStarted} icon={<ZapIcon size={14} />} />
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <QuickActionCard
          href="/dashboard/artworks/new"
          icon={<PlusIcon size={16} />}
          title="Upload new artwork"
          body="Drop in an image and we'll generate the product page."
        />
        <QuickActionCard
          href="/dashboard/ai-studio"
          icon={<SparklesIcon size={16} />}
          title="Open AI Studio"
          body="Refresh captions, rewrite descriptions, change tone."
        />
        <QuickActionCard
          href="/dashboard/storefront"
          icon={<StoreIcon size={16} />}
          title="Customise storefront"
          body="Change theme, hero copy, and brand colours."
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  trend?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-5 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${accent} text-white`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">{value}</p>
      {trend ? (
        <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
          <TrendingUpIcon size={11} /> {trend}
        </p>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2.5 text-sm dark:border-zinc-900 dark:bg-zinc-900/30">
      <span className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
        {icon ? <span className="text-zinc-400">{icon}</span> : null}
        {label}
      </span>
      <span className="font-semibold text-zinc-900 dark:text-white">{value}</span>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  body,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-500/40"
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
          <ArrowRightIcon size={12} className="text-zinc-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
        </p>
        <p className="mt-0.5 text-xs text-zinc-500">{body}</p>
      </div>
    </Link>
  );
}
