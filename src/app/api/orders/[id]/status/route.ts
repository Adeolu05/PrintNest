import { NextResponse } from "next/server";
import { orderStatusUpdateSchema } from "@/lib/validators";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser } from "@/server/repositories/stores";
import {
  getOrderWithItems,
  updateOrderStatus,
} from "@/server/repositories/orders";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!hasServerSupabase()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const store = await getStoreByUser(user.id);
  if (!store) return NextResponse.json({ error: "No store" }, { status: 404 });

  const data = await getOrderWithItems(id);
  if (!data || data.order.store_id !== store.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = orderStatusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const order = await updateOrderStatus(id, {
    order_status: parsed.data.orderStatus,
    payment_status: parsed.data.paymentStatus,
  });
  return NextResponse.json({ order });
}
