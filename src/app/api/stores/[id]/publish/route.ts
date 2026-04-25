import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser, publishStore } from "@/server/repositories/stores";

const schema = z.object({ publish: z.boolean().default(true) });

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let ownerId = "local-user";
  if (hasServerSupabase()) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    ownerId = user.id;
  }
  const owned = await getStoreByUser(ownerId);
  if (!owned || owned.id !== id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  const publish = parsed.success ? parsed.data.publish : true;

  const store = await publishStore(id, publish);
  return NextResponse.json({ store });
}
