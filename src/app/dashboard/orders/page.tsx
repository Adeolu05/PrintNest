import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader, EmptyState } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { listOrdersForStore } from "@/server/repositories/orders";
import { hasServerSupabase } from "@/server/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");
  const store = user ? await getStoreByUser(user.id).catch(() => null) : null;
  if (!store) {
    return (
      <div>
        <PageHeader title="Orders" />
        <EmptyState
          title="No store yet"
          description="Set up your storefront to receive structured orders from buyers."
          action={
            <Link href="/dashboard/onboarding">
              <Button>Start onboarding</Button>
            </Link>
          }
        />
      </div>
    );
  }
  const orders = await listOrdersForStore(store.id).catch(() => []);

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Every WhatsApp checkout starts here. Update statuses as you fulfil."
      />
      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Share your store link to start receiving orders. We'll keep them organised here."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{orders.length} orders</CardTitle>
          </CardHeader>
          <CardBody className="overflow-x-auto p-0">
            <table className="min-w-full divide-y divide-zinc-100 text-sm dark:divide-zinc-900">
              <thead className="bg-zinc-50 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2">Order</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium text-zinc-900 dark:text-white">
                      <Link href={`/dashboard/orders/${order.id}`} className="hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-200">
                      {formatCurrency(Number(order.total_amount), order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={order.payment_status === "paid" ? "success" : "warning"}>
                        {order.payment_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{order.order_status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
