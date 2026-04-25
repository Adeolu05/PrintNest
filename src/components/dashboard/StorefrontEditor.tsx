"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { STORE_THEMES } from "@/lib/constants";

type Initial = {
  themeId: string;
  accentColor: string;
  displayMode: string;
  heroHeadline: string;
  heroSubheadline: string;
  bio: string;
  isPublished: boolean;
  storeSlug: string;
};

const DISPLAY_MODES = [
  { id: "gallery", label: "Gallery" },
  { id: "shop_grid", label: "Shop grid" },
  { id: "editorial", label: "Editorial" },
  { id: "portfolio_shop", label: "Portfolio + Shop" },
];

export function StorefrontEditor({
  storeId,
  initial,
}: {
  storeId: string;
  initial: Initial;
}) {
  const [themeId, setThemeId] = useState(initial.themeId);
  const [accentColor, setAccentColor] = useState(initial.accentColor);
  const [displayMode, setDisplayMode] = useState(initial.displayMode);
  const [heroHeadline, setHeroHeadline] = useState(initial.heroHeadline);
  const [heroSubheadline, setHeroSubheadline] = useState(initial.heroSubheadline);
  const [bio, setBio] = useState(initial.bio);
  const [isPublished, setIsPublished] = useState(initial.isPublished);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId,
          accentColor,
          displayMode,
          heroHeadline,
          heroSubheadline,
          bio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      setInfo("Storefront updated.");
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not save";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function handlePublishToggle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/stores/${storeId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publish: !isPublished }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update");
      setIsPublished(!isPublished);
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not update";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-white">Status</p>
          <p className="text-xs text-zinc-500">
            Public URL: <span className="font-medium text-zinc-700 dark:text-zinc-200">/s/{initial.storeSlug}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={isPublished ? "success" : "warning"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
          <Button onClick={handlePublishToggle} loading={busy} variant={isPublished ? "outline" : "primary"}>
            {isPublished ? "Unpublish" : "Publish storefront"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Hero headline" hint="Shown at the top of your storefront. Leave blank to use a sensible default.">
          <Input value={heroHeadline} onChange={(e) => setHeroHeadline(e.target.value)} maxLength={120} />
        </FormField>
        <FormField label="Hero subheadline">
          <Input value={heroSubheadline} onChange={(e) => setHeroSubheadline(e.target.value)} maxLength={280} />
        </FormField>
      </div>
      <FormField label="Artist bio">
        <Textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} />
      </FormField>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Theme">
          <Select value={themeId} onChange={(e) => setThemeId(e.target.value)}>
            {STORE_THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Display mode">
          <Select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
            {DISPLAY_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Accent colour" hint="HEX code, e.g. #111111">
          <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} pattern="#[0-9a-fA-F]{6}" />
        </FormField>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {info ? <p className="text-sm text-emerald-600">{info}</p> : null}

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={busy}>
          Save changes
        </Button>
      </div>
    </div>
  );
}
