"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, FormField } from "@/components/ui/input";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

export function OrderStatusForm({
  orderId,
  order,
  payment,
}: {
  orderId: string;
  order: string;
  payment: string;
}) {
  const [orderStatus, setOrderStatus] = useState(order);
  const [paymentStatus, setPaymentStatus] = useState(payment);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update");
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not update";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <FormField label="Order status">
        <Select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Payment status">
        <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </FormField>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <Button onClick={handleSave} loading={busy} fullWidth>
        Save status
      </Button>
    </div>
  );
}
