import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser } from "@/server/repositories/stores";
import { listOrdersForStore } from "@/server/repositories/orders";

export async function GET() {
  if (!hasServerSupabase()) return NextResponse.json({ orders: [] });
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const store = await getStoreByUser(user.id);
  if (!store) return NextResponse.json({ orders: [] });
  const orders = await listOrdersForStore(store.id);
  return NextResponse.json({ orders });
}
