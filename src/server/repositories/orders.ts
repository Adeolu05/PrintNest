import "server-only";

import { getServiceSupabase, hasServerSupabase } from "@/server/supabase";

export type OrderRow = {
  id: string;
  store_id: string;
  customer_id: string | null;
  order_number: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  delivery_address: string | null;
  customer_note: string | null;
  whatsapp_message: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  artwork_id: string | null;
  variant_id: string | null;
  title_snapshot: string;
  size_snapshot: string | null;
  frame_snapshot: string | null;
  price_snapshot: number;
  quantity: number;
  created_at: string;
};

export type CustomerRow = {
  id: string;
  store_id: string;
  name: string;
  email: string | null;
  phone: string;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export async function listOrdersForStore(storeId: string) {
  if (!hasServerSupabase()) return [] as OrderRow[];
  const { data, error } = await getServiceSupabase()
    .from("orders")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export async function getOrderWithItems(id: string) {
  const supabase = getServiceSupabase();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!order) return null;
  const { data: items, error: itemsErr } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);
  if (itemsErr) throw itemsErr;
  let customer: CustomerRow | null = null;
  if (order.customer_id) {
    const { data: c } = await supabase
      .from("customers")
      .select("*")
      .eq("id", order.customer_id)
      .maybeSingle();
    customer = (c as CustomerRow) ?? null;
  }
  return {
    order: order as OrderRow,
    items: (items ?? []) as OrderItemRow[],
    customer,
  };
}

export async function upsertCustomer(input: Omit<CustomerRow, "id" | "created_at" | "updated_at">) {
  const supabase = getServiceSupabase();
  const { data: existing } = await supabase
    .from("customers")
    .select("*")
    .eq("store_id", input.store_id)
    .eq("phone", input.phone)
    .maybeSingle();
  if (existing) {
    const { data, error } = await supabase
      .from("customers")
      .update({
        name: input.name,
        email: input.email,
        address: input.address,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data as CustomerRow;
  }
  const { data, error } = await supabase
    .from("customers")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as CustomerRow;
}

export type CreateOrderInput = {
  store_id: string;
  customer_id: string | null;
  order_number: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  delivery_address: string | null;
  customer_note: string | null;
  whatsapp_message: string;
  items: Array<Omit<OrderItemRow, "id" | "order_id" | "created_at">>;
};

export async function createOrder(input: CreateOrderInput) {
  const supabase = getServiceSupabase();
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      store_id: input.store_id,
      customer_id: input.customer_id,
      order_number: input.order_number,
      total_amount: input.total_amount,
      currency: input.currency,
      payment_method: input.payment_method,
      delivery_address: input.delivery_address,
      customer_note: input.customer_note,
      whatsapp_message: input.whatsapp_message,
    })
    .select("*")
    .single();
  if (error) throw error;
  const itemRows = input.items.map((item) => ({ ...item, order_id: order.id }));
  const { error: itemsErr } = await supabase
    .from("order_items")
    .insert(itemRows);
  if (itemsErr) throw itemsErr;
  return order as OrderRow;
}

export async function updateOrderStatus(
  id: string,
  patch: { order_status?: string; payment_status?: string },
) {
  const { data, error } = await getServiceSupabase()
    .from("orders")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as OrderRow;
}

export function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PN-${stamp}-${rand}`;
}
