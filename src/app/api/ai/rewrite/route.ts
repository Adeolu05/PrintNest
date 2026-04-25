import { NextResponse } from "next/server";
import { aiRewriteSchema } from "@/lib/validators";
import { rewriteCopy } from "@/server/ai/openai";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = aiRewriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const text = await rewriteCopy(parsed.data.text, parsed.data.action, parsed.data.tone);
  return NextResponse.json({ text });
}
