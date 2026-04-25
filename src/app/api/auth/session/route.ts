import { NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie, clearSessionCookie } from "@/server/auth";

const schema = z.object({
  accessToken: z.string().min(10),
  expiresIn: z.number().int().positive().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  await setSessionCookie(parsed.data.accessToken, parsed.data.expiresIn ?? 60 * 60 * 24 * 7);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
