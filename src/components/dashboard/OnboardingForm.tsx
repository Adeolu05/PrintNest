"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { STORE_THEMES, SUPPORTED_CURRENCIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

const COUNTRIES = ["Nigeria", "Ghana", "Kenya", "South Africa", "United Kingdom", "United States", "Canada", "Other"];

type Props = {
  defaultName?: string;
  defaultEmail?: string;
};

export function OnboardingForm({ defaultName = "" }: Props) {
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [artistName, setArtistName] = useState(defaultName);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [city, setCity] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [bio, setBio] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [xUrl, setXUrl] = useState("");
  const [themeId, setThemeId] = useState<string>(STORE_THEMES[0].id);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const router = useRouter();

  const finalSlug = useMemo(() => slugify(slugTouched ? storeSlug : storeName), [storeName, storeSlug, slugTouched]);

  useEffect(() => {
    if (!finalSlug || finalSlug.length < 2) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stores/check-slug?slug=${encodeURIComponent(finalSlug)}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 350);
    return () => clearTimeout(handle);
  }, [finalSlug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (slugStatus === "taken") {
      setError("That store URL is already taken. Try a different one.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          storeSlug: finalSlug,
          artistName,
          whatsappNumber,
          country,
          city,
          currency,
          bio,
          instagramUrl,
          tiktokUrl,
          xUrl,
          themeId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not create store");
      }
      router.push("/dashboard/artworks/new");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your store</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 md:grid-cols-2">
          <FormField label="Store name" required hint="Shown on your storefront and shareable links.">
            <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} required placeholder="Tola Adebayo Prints" />
          </FormField>
          <FormField
            label="Store URL"
            required
            hint={
              slugStatus === "checking"
                ? "Checking availability…"
                : slugStatus === "taken"
                ? "That URL is taken. Try another."
                : `Your store will live at /s/${finalSlug || "your-slug"}`
            }
            error={slugStatus === "taken" ? "Slug is taken" : null}
          >
            <Input
              value={slugTouched ? storeSlug : finalSlug}
              onChange={(e) => {
                setSlugTouched(true);
                setStoreSlug(slugify(e.target.value));
              }}
              required
              placeholder="tola-prints"
            />
          </FormField>
          <FormField label="Artist name" required>
            <Input value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
          </FormField>
          <FormField label="WhatsApp number" required hint="Used for buyer checkout. Include country code.">
            <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} required placeholder="+234…" />
          </FormField>
          <FormField label="Country" required>
            <Select value={country} onChange={(e) => setCountry(e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="City">
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos" />
          </FormField>
          <FormField label="Currency" required>
            <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} – {c.label}
                </option>
              ))}
            </Select>
          </FormField>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tell buyers about your work</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <FormField label="Short bio" hint="One or two sentences. We'll use this on your store homepage.">
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              placeholder="Lagos-based abstract painter exploring colour, motion, and city memory."
            />
          </FormField>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField label="Instagram URL">
              <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/…" />
            </FormField>
            <FormField label="TikTok URL">
              <Input value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} placeholder="https://tiktok.com/@…" />
            </FormField>
            <FormField label="X / Twitter URL">
              <Input value={xUrl} onChange={(e) => setXUrl(e.target.value)} placeholder="https://x.com/…" />
            </FormField>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose a starting theme</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {STORE_THEMES.map((theme) => {
              const active = themeId === theme.id;
              return (
                <button
                  type="button"
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={
                    active
                      ? "rounded-2xl border-2 border-zinc-900 bg-white p-4 text-left shadow-sm dark:border-white dark:bg-zinc-900"
                      : "rounded-2xl border border-zinc-200 bg-white p-4 text-left transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950"
                  }
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">{theme.name}</p>
                    {active ? <Badge tone="success">Selected</Badge> : null}
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">{theme.description}</p>
                  <div className="mt-3 h-12 rounded-md" style={{ backgroundColor: theme.accent }} />
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="submit" loading={submitting} size="lg">
          Create store
        </Button>
      </div>
    </form>
  );
}
