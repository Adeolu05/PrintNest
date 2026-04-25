"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

type Initial = {
  storeName: string;
  artistName: string;
  whatsappNumber: string;
  instagramUrl: string;
  tiktokUrl: string;
  xUrl: string;
  currency: string;
  country: string;
  city: string;
  bio: string;
};

export function SettingsForm({ storeId, initial }: { storeId: string; initial: Initial }) {
  const [state, setState] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();

  function update<K extends keyof Initial>(key: K, value: Initial[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const res = await fetch(`/api/stores/${storeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save");
      setInfo("Settings saved.");
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not save";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <FormField label="Store name" required>
          <Input value={state.storeName} onChange={(e) => update("storeName", e.target.value)} required />
        </FormField>
        <FormField label="Artist name" required>
          <Input value={state.artistName} onChange={(e) => update("artistName", e.target.value)} required />
        </FormField>
        <FormField label="WhatsApp number" required>
          <Input value={state.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} required />
        </FormField>
        <FormField label="Currency">
          <Select value={state.currency} onChange={(e) => update("currency", e.target.value)}>
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Country">
          <Input value={state.country} onChange={(e) => update("country", e.target.value)} />
        </FormField>
        <FormField label="City">
          <Input value={state.city} onChange={(e) => update("city", e.target.value)} />
        </FormField>
      </div>
      <FormField label="Bio">
        <Textarea value={state.bio} onChange={(e) => update("bio", e.target.value)} maxLength={500} />
      </FormField>
      <div className="grid gap-3 md:grid-cols-3">
        <FormField label="Instagram">
          <Input value={state.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} />
        </FormField>
        <FormField label="TikTok">
          <Input value={state.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} />
        </FormField>
        <FormField label="X / Twitter">
          <Input value={state.xUrl} onChange={(e) => update("xUrl", e.target.value)} />
        </FormField>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {info ? <p className="text-sm text-emerald-600">{info}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" loading={busy}>
          Save settings
        </Button>
      </div>
    </form>
  );
}
