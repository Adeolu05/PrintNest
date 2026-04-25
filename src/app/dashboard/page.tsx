import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, EmptyState } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
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
        <PageHeader title="Welcome to PrintNest" description="Set up your storefront in a few minutes." />
        <EmptyState
          title="Create your storefront"
          description="Tell us your artist name, WhatsApp number, and where you sell from. We'll generate your store URL automatically."
          action={
            <Link href="/dashboard/onboarding">
              <Button>Start onboarding</Button>
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
        title={`Hello${user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}`}
        description={`${store.store_name} · ${store.is_published ? "Published" : "Draft"}`}
        actions={
          <>
            <Link href="/dashboard/artworks/new">
              <Button>Upload artwork</Button>
            </Link>
            <Link href={`/s/${store.store_slug}`} target="_blank">
              <Button variant="outline">Preview store</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total artworks" value={String(artworks.length)} />
        <StatCard label="Total orders" value={String(orders.length)} />
        <StatCard label="Pending orders" value={String(pendingOrders.length)} />
        <StatCard label="Revenue (paid)" value={formatCurrency(revenue, store.currency)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent orders</CardTitle>
              <Link href="/dashboard/orders" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {orders.length === 0 ? (
              <p className="text-sm text-zinc-500">No orders yet. Share your store link to start receiving orders.</p>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {orders.slice(0, 6).map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="font-medium text-zinc-900 hover:underline dark:text-white"
                    >
                      {order.order_number}
                    </Link>
                    <span className="text-xs text-zinc-500">{formatDate(order.created_at)}</span>
                    <Badge tone={order.payment_status === "paid" ? "success" : "warning"}>
                      {order.payment_status}
                    </Badge>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">
                      {formatCurrency(Number(order.total_amount), order.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Storefront traffic</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <Stat label="Store views" value={String(stats.storeViews)} />
            <Stat label="Artwork views" value={String(stats.artworkViews)} />
            <Stat label="Checkouts started" value={String(stats.checkoutsStarted)} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-zinc-900 dark:text-white">{value}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-900 dark:text-white">{value}</span>
    </div>
  );
}
