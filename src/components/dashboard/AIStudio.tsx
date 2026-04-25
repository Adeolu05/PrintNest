"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField, Select, Textarea } from "@/components/ui/input";
import { AI_TONES } from "@/lib/constants";

const TYPES = [
  { id: "caption", label: "Instagram caption" },
  { id: "bio", label: "Artist bio" },
  { id: "announcement", label: "Drop announcement" },
  { id: "whatsapp", label: "WhatsApp sales message" },
  { id: "seo", label: "SEO description" },
];

export function AIStudio() {
  const [type, setType] = useState("caption");
  const [tone, setTone] = useState("simple");
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-artwork-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tone,
          notes: `Generate a ${type}. ${notes}`.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      const draft = data.draft;
      const text =
        type === "caption"
          ? draft.instagramCaption
          : type === "bio"
          ? draft.shortDescription
          : type === "whatsapp"
          ? draft.whatsappMessage
          : type === "seo"
          ? draft.seoDescription
          : draft.longDescription;
      setOutput(text);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Generation failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRewrite(action: string) {
    if (!output) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: output, action, tone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Rewrite failed");
      setOutput(data.text);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Rewrite failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <FormField label="What do you need?">
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Tone">
          <Select value={tone} onChange={(e) => setTone(e.target.value)}>
            {AI_TONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Context (optional)">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={800} />
        </FormField>
        <Button onClick={handleGenerate} loading={busy}>
          Generate
        </Button>
      </div>
      <div className="space-y-3">
        <FormField label="Output">
          <Textarea value={output} onChange={(e) => setOutput(e.target.value)} className="min-h-[200px]" />
        </FormField>
        <div className="flex flex-wrap gap-2">
          {(["simpler", "luxury", "poetic", "shorter", "nigerian", "seo", "premium", "emotional"] as const).map((action) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => handleRewrite(action)}
              disabled={!output || busy}
            >
              Make {action}
            </Button>
          ))}
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}
