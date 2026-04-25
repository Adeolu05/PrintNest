import { NextResponse } from "next/server";
import { z } from "zod";
import { generateArtworkCopy } from "@/server/ai/openai";

const schema = z.object({
  category: z.string().optional(),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional(),
  currency: z.string().default("NGN"),
});

/**
 * Lightweight wrapper that re-uses the artwork copy generator and surfaces
 * only the suggested price range. Useful for the dashboard "Suggest price"
 * action without forcing a full description regeneration.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const draft = await generateArtworkCopy(
    {
      tone: "simple",
      notes: parsed.data.notes,
      category: parsed.data.category,
      hasImage: Boolean(parsed.data.imageUrl),
    },
    parsed.data.imageUrl,
  );
  const range = draft.suggestedPriceRange ?? { low: 0, high: 0, rationale: "" };
  return NextResponse.json({ suggestedPriceRange: range, currency: parsed.data.currency });
}
