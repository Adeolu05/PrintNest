import { NextResponse } from "next/server";
import { aiGenerateSchema } from "@/lib/validators";
import { generateArtworkCopy } from "@/server/ai/openai";
import { getSessionUser } from "@/server/auth";
import { hasServerSupabase } from "@/server/supabase";
import { getStoreByUser } from "@/server/repositories/stores";
import { getServiceSupabase } from "@/server/supabase";
import { env } from "@/lib/env";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = aiGenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const user = await getSessionUser();
  if (!user && hasServerSupabase()) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const draft = await generateArtworkCopy(
    {
      tone: parsed.data.tone,
      notes: parsed.data.notes,
      medium: parsed.data.medium,
      category: parsed.data.category,
      audience: parsed.data.audience,
      language: parsed.data.language,
      includeOriginal: parsed.data.includeOriginal,
      includeLimitedEdition: parsed.data.includeLimitedEdition,
      hasImage: Boolean(parsed.data.imageUrl),
    },
    parsed.data.imageUrl,
  );

  // Best-effort logging of the generation event for the admin dashboard.
  if (hasServerSupabase() && user) {
    try {
      const store = await getStoreByUser(user.id);
      if (store) {
        await getServiceSupabase()
          .from("ai_generations")
          .insert({
            store_id: store.id,
            artwork_id: parsed.data.artworkId ?? null,
            generation_type: "artwork_copy",
            prompt_input: parsed.data,
            output: draft,
            tone: parsed.data.tone,
            model: env.openai.model,
          });
      }
    } catch {
      // Ignore logging errors
    }
  }

  return NextResponse.json({ draft });
}
