import type { AIToneId } from "@/lib/constants";

export const TONE_INSTRUCTIONS: Record<AIToneId, string> = {
  simple: "Plain, clear, and warm. Short sentences. No marketing fluff.",
  premium: "Confident and refined. Hint at craft and care without bragging.",
  poetic: "Evocative and rhythmic. Use sensory imagery, but stay grounded.",
  gallery: "Like a museum wall card. Calm, observational, slightly formal.",
  minimal: "Spare. One short paragraph. No adjectives stacking.",
  bold: "Punchy and direct. Strong verbs. Confident tone, no exclamation marks.",
  warm: "Inviting and human. Like a good friend describing the work.",
  luxury: "Quietly elegant. Reference materials and finishing only if provided.",
  afro: "Modern African voice. Reference culture or place when relevant.",
  instagram: "Casual, scrollable. Up to 2 short paragraphs. May use 1 emoji.",
  seo: "Natural sentences that include the key descriptive terms an art buyer might search.",
};

export const GUARDRAILS = `
You are PrintNest's copy assistant for visual artists. Follow these rules strictly:
- Never claim the work is "original", "one of a kind", or "limited edition" unless the artist's notes or flags say so.
- Never invent the medium, paper, ink, frame, or finishing if not provided. If absent, talk about mood, colour, and use, not materials.
- Never claim "museum-grade", "archival", or "gallery-quality" unless explicitly provided.
- Never invent dimensions, prices, or scarcity ("only 3 left", "selling fast", etc.).
- Avoid hyperbole: no "best ever", "world-class", "iconic".
- Use plain English by default. Never repeat the title in every sentence.
- Output must be safe, respectful, and inclusive.
`;

export type CopyRequest = {
  tone: AIToneId | string;
  notes?: string;
  medium?: string;
  category?: string;
  audience?: string;
  language?: string;
  hasImage?: boolean;
  includeOriginal?: boolean;
  includeLimitedEdition?: boolean;
};

export function buildCopyInstruction(req: CopyRequest): string {
  const lines: string[] = [];
  const toneInstruction =
    TONE_INSTRUCTIONS[req.tone as AIToneId] ?? TONE_INSTRUCTIONS.simple;
  lines.push(`Tone: ${toneInstruction}`);
  if (req.language) lines.push(`Language: ${req.language}.`);
  if (req.audience) lines.push(`Audience: ${req.audience}.`);
  if (req.category) lines.push(`Artwork category: ${req.category}.`);
  if (req.medium) lines.push(`Stated medium: ${req.medium}.`);
  if (req.notes) lines.push(`Artist notes: ${req.notes}`);

  const allow: string[] = [];
  if (req.includeOriginal) allow.push("the artist confirmed this is an original work");
  if (req.includeLimitedEdition) allow.push("the artist marked this as a limited edition");
  if (allow.length > 0) {
    lines.push(`Approved facts you may state: ${allow.join("; ")}.`);
  }
  if (req.hasImage) {
    lines.push("Use the attached image as visual context for mood and colour.");
  } else {
    lines.push("There is no image attached. Stay general about the visual and avoid making up specifics.");
  }
  return lines.join("\n");
}

export const COPY_OUTPUT_SCHEMA_HINT = `
Respond with strict JSON in this shape, no extra commentary:
{
  "title": string,
  "shortDescription": string,         // 1-2 sentences, max 220 chars
  "longDescription": string,          // 1-2 short paragraphs, max 700 chars
  "seoTitle": string,                 // max 65 chars
  "seoDescription": string,           // max 160 chars
  "altText": string,                  // accessible alt text, max 140 chars
  "tags": string[],                   // 3-8 lowercase tags
  "instagramCaption": string,         // up to 280 chars
  "whatsappMessage": string,          // friendly sales-ready short message
  "suggestedPriceRange": {            // currency-agnostic numbers, optional
    "low": number,
    "high": number,
    "rationale": string
  }
}
`;
