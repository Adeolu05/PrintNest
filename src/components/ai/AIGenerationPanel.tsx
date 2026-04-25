"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Select, Textarea } from "@/components/ui/input";
import { AI_TONES } from "@/lib/constants";

export type AIGeneratedDraft = {
  title: string;
  shortDescription: string;
  longDescription: string;
  seoTitle: string;
  seoDescription: string;
  altText: string;
  tags: string[];
  instagramCaption: string;
  whatsappMessage: string;
  suggestedPriceRange?: { low: number; high: number; rationale: string };
};

type Props = {
  imageUrl?: string | null;
  defaultCategory?: string;
  defaultMedium?: string;
  defaultNotes?: string;
  onGenerated: (draft: AIGeneratedDraft) => void;
};

export function AIGenerationPanel({
  imageUrl,
  defaultCategory,
  defaultMedium,
  defaultNotes,
  onGenerated,
}: Props) {
  const [tone, setTone] = useState<string>("simple");
  const [language, setLanguage] = useState("English");
  const [audience, setAudience] = useState("Independent art collectors at home");
  const [notes, setNotes] = useState(defaultNotes ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<AIGeneratedDraft | null>(null);

  async function handleGenerate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-artwork-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone,
          notes,
          medium: defaultMedium,
          category: defaultCategory,
          audience,
          language,
          imageUrl: imageUrl ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setLatest(data.draft);
      onGenerated(data.draft);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Generation failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI copy assistant</CardTitle>
          <span className="text-xs text-zinc-500">Edit anything before saving.</span>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <FormField label="Tone">
            <Select value={tone} onChange={(e) => setTone(e.target.value)}>
              {AI_TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Language">
            <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {["English", "Pidgin", "French", "Yoruba", "Igbo", "Hausa"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Audience">
            <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
              {[
                "Independent art collectors at home",
                "Young creatives furnishing studios",
                "Interior designers",
                "Gift buyers",
                "Office and co-working spaces",
              ].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </Select>
          </FormField>
        </div>
        <FormField
          label="Notes about this artwork (optional)"
          hint="Mood, story, colours, inspiration. We'll use this — and the image, if uploaded — to write copy."
        >
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={800}
            placeholder="Inspired by Lagos at sunset. Bold orange and deep blue. Wants to feel energetic but calm."
          />
        </FormField>
        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={handleGenerate} loading={busy}>
            {latest ? "Regenerate" : "Generate copy"}
          </Button>
          {latest ? (
            <span className="text-xs text-zinc-500">
              Tags: {latest.tags.slice(0, 4).join(", ")}
            </span>
          ) : null}
        </div>
        {latest?.suggestedPriceRange ? (
          <p className="text-xs text-zinc-500">
            Suggested price range: {latest.suggestedPriceRange.low.toLocaleString()} –{" "}
            {latest.suggestedPriceRange.high.toLocaleString()} · {latest.suggestedPriceRange.rationale}
          </p>
        ) : null}
      </CardBody>
    </Card>
  );
}
