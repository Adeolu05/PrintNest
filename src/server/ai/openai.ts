import "server-only";

import OpenAI from "openai";
import { env, isOpenAIConfigured } from "@/lib/env";
import {
  buildCopyInstruction,
  COPY_OUTPUT_SCHEMA_HINT,
  GUARDRAILS,
  TONE_INSTRUCTIONS,
  type CopyRequest,
} from "./prompts";

export type GeneratedCopy = {
  title: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
  altText: string;
  tags: string[];
  instagramCaption: string;
  whatsappMessage: string;
  suggestedPriceRange?: {
    low: number;
    high: number;
    rationale: string;
  };
};

let cachedClient: OpenAI | null = null;
function getClient() {
  if (!isOpenAIConfigured) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new OpenAI({ apiKey: env.openai.apiKey });
  return cachedClient;
}

/**
 * Generate full artwork copy. If OpenAI is not configured, falls back to a
 * deterministic stub so the rest of the app remains usable in local/dev mode.
 */
export async function generateArtworkCopy(
  req: CopyRequest,
  imageUrl?: string,
): Promise<GeneratedCopy> {
  const client = getClient();
  if (!client) {
    return stubCopy(req);
  }

  const userInstruction = buildCopyInstruction({ ...req, hasImage: Boolean(imageUrl) });

  const response = await client.chat.completions.create({
    model: imageUrl ? env.openai.visionModel : env.openai.model,
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: GUARDRAILS },
      {
        role: "user",
        content: imageUrl
          ? [
              { type: "text", text: `${userInstruction}\n\n${COPY_OUTPUT_SCHEMA_HINT}` },
              { type: "image_url", image_url: { url: imageUrl } },
            ]
          : `${userInstruction}\n\n${COPY_OUTPUT_SCHEMA_HINT}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? "";
  return parseCopy(text, req);
}

const REWRITE_PRESETS: Record<string, string> = {
  regenerate: "Rewrite this freshly, keeping the same key facts but a new angle.",
  simpler: "Rewrite this in plain, simpler English. Shorter sentences.",
  luxury: "Rewrite this with a quietly luxurious, refined voice. No bragging.",
  poetic: "Rewrite this with poetic imagery while staying grounded.",
  shorter: "Rewrite this in roughly half the length, keeping the key idea.",
  nigerian: "Rewrite this in a modern Nigerian voice, warm and confident, plain English.",
  seo: "Rewrite this with natural keywords an art buyer might search, while keeping it human.",
  premium: "Rewrite this to sound premium and considered, not boastful.",
  emotional: "Rewrite this so the emotional pull comes through more clearly.",
};

export async function rewriteCopy(
  text: string,
  action: string,
  tone?: string,
): Promise<string> {
  const client = getClient();
  if (!client) {
    return stubRewrite(text, action);
  }
  const instruction = REWRITE_PRESETS[action] ?? REWRITE_PRESETS.regenerate;
  const toneKey = tone as keyof typeof TONE_INSTRUCTIONS | undefined;
  const toneNote = toneKey && TONE_INSTRUCTIONS[toneKey] ? `Tone: ${TONE_INSTRUCTIONS[toneKey]}` : "";
  const response = await client.chat.completions.create({
    model: env.openai.model,
    temperature: 0.7,
    messages: [
      { role: "system", content: GUARDRAILS },
      {
        role: "user",
        content: `${instruction}\n${toneNote}\n\nText:\n${text}`,
      },
    ],
  });
  return response.choices[0]?.message?.content?.trim() ?? text;
}

function parseCopy(text: string, req: CopyRequest): GeneratedCopy {
  try {
    const parsed = JSON.parse(text);
    const tags = Array.isArray(parsed.tags) ? parsed.tags.slice(0, 8) : [];
    return {
      title: String(parsed.title ?? "Untitled work"),
      shortDescription: String(parsed.shortDescription ?? "").slice(0, 240),
      longDescription: String(parsed.longDescription ?? "").slice(0, 800),
      seoTitle: String(parsed.seoTitle ?? "").slice(0, 70),
      seoDescription: String(parsed.seoDescription ?? "").slice(0, 170),
      altText: String(parsed.altText ?? "").slice(0, 160),
      tags: tags.map((t: unknown) => String(t).toLowerCase()).filter(Boolean),
      instagramCaption: String(parsed.instagramCaption ?? "").slice(0, 320),
      whatsappMessage: String(parsed.whatsappMessage ?? "").slice(0, 600),
      suggestedPriceRange: parsed.suggestedPriceRange
        ? {
            low: Number(parsed.suggestedPriceRange.low) || 0,
            high: Number(parsed.suggestedPriceRange.high) || 0,
            rationale: String(parsed.suggestedPriceRange.rationale ?? ""),
          }
        : undefined,
    };
  } catch {
    return stubCopy(req);
  }
}

function stubCopy(req: CopyRequest): GeneratedCopy {
  const subject = req.notes?.split(/\s+/).slice(0, 4).join(" ") || "this work";
  const tone = req.tone ?? "simple";
  return {
    title: `Untitled (${subject})`,
    shortDescription: `A ${tone} ${req.category?.toLowerCase() ?? "wall"} print built around ${subject}.`,
    longDescription: `This print works for living rooms, studios, and creative offices. The composition keeps a calm centre while the colour story carries the energy. Hang it where you want a quiet moment of focus.`,
    seoTitle: `${subject} – PrintNest`,
    seoDescription: `Buy a high-quality print of ${subject} from an independent artist on PrintNest.`,
    altText: `${subject} – ${req.category ?? "art"} print.`,
    tags: ["wall art", "art print", "modern", req.category?.toLowerCase() ?? "art"].filter(Boolean),
    instagramCaption: `New drop. ${subject} — now available as a print. Link in bio.`,
    whatsappMessage: `Hi! ${subject} is now available as a print on my PrintNest store. Want to grab one?`,
    suggestedPriceRange: { low: 8000, high: 25000, rationale: "Stub estimate based on common A3 print pricing in NGN." },
  };
}

function stubRewrite(text: string, action: string): string {
  if (action === "shorter") return text.split(/(?<=[.!?])\s+/).slice(0, 1).join(" ");
  if (action === "simpler") return text.replace(/\b(utilise|leverage|enhance)\b/gi, "use");
  return text;
}
