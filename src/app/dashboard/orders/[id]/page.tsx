import { notFound, redirect } from "next/navigation";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/section";
import { OrderStatusForm } from "@/components/dashboard/OrderStatusForm";
import { getSessionUser } from "@/server/auth";
import { getStoreByUser } from "@/server/repositories/stores";
import { getOrderWithItems } from "@/server/repositories/orders";
import { hasServerSupabase } from "@/server/supabase";
import { formatCurrency, formatDate } from "@/lib/utils";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user && hasServerSupabase()) redirect("/login");
  const store = user ? await getStoreByUser(user.id).catch(() => null) : null;
  if (!store) redirect("/dashboard/onboarding");
  const data = await getOrderWithItems(id);
  if (!data || data.order.store_id !== store.id) notFound();

  const { order, items, customer } = data;
  const whatsappUrl = customer
    ? buildWhatsAppLink(
        customer.phone,
        `Hi ${customer.name}, this is ${store.artist_name} confirming your order ${order.order_number}.`,
      )
    : null;

  return (
    <div>
      <PageHeader
        title={order.order_number}
        description={`Created ${formatDate(order.created_at)}`}
        actions={
          whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
            >
              Message customer
            </a>
          ) : null
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-100 px-3 py-2 dark:border-zinc-900">
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.title_snapshot}</p>
                  <p className="text-xs text-zinc-500">
                    {[item.size_snapshot, item.frame_snapshot].filter(Boolean).join(" · ") || "Standard"}
                  </p>
                </div>
                <div className="text-right text-xs text-zinc-500">
                  <p>Qty {item.quantity}</p>
                  <p className="text-zinc-700 dark:text-zinc-200">
                    {formatCurrency(Number(item.price_snapshot), order.currency)}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-900">
              <p className="text-sm text-zinc-500">Total</p>
              <p className="text-base font-semibold text-zinc-900 dark:text-white">
                {formatCurrency(Number(order.total_amount), order.currency)}
              </p>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              {customer ? (
                <>
                  <p className="font-medium text-zinc-900 dark:text-white">{customer.name}</p>
                  <p className="text-zinc-500">{customer.phone}</p>
                  {customer.email ? <p className="text-zinc-500">{customer.email}</p> : null}
                </>
              ) : (
                <p className="text-zinc-500">No customer record.</p>
              )}
              <p className="rounded-lg bg-zinc-50 p-3 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                {order.delivery_address ?? "No delivery address on file."}
              </p>
              {order.customer_note ? (
                <p className="rounded-lg border border-zinc-100 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-900">
                  Note: {order.customer_note}
                </p>
              ) : null}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Payment</span>
                <Badge tone={order.payment_status === "paid" ? "success" : "warning"}>
                  {order.payment_status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Order</span>
                <Badge>{order.order_status}</Badge>
              </div>
              <OrderStatusForm orderId={order.id} order={order.order_status} payment={order.payment_status} />
            </CardBody>
          </Card>

          {order.whatsapp_message ? (
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp message</CardTitle>
              </CardHeader>
              <CardBody>
                <pre className="whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {order.whatsapp_message}
                </pre>
              </CardBody>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
