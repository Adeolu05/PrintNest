"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, FormField, Select } from "@/components/ui/input";
import type { ArtworkRow, ArtworkVariantRow } from "@/server/repositories/artworks";
import type { StoreRow } from "@/server/repositories/stores";
import { formatCurrency } from "@/lib/utils";
import { trackEvent } from "@/components/AnalyticsProvider";
import { ANALYTICS_EVENTS } from "@/lib/constants";

type Props = {
  store: StoreRow;
  artwork: ArtworkRow;
  variants: ArtworkVariantRow[];
};

export function ProductDetail({ store, artwork, variants }: Props) {
  const [variantId, setVariantId] = useState<string | null>(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const selected = useMemo(
    () => variants.find((v) => v.id === variantId) ?? null,
    [variants, variantId],
  );
  const unitPrice = selected ? Number(selected.price) : Number(artwork.base_price);
  const total = unitPrice * quantity;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      trackEvent(ANALYTICS_EVENTS.checkoutStarted, {
        storeSlug: store.store_slug,
        artworkId: artwork.id,
      });
      const res = await fetch("/api/checkout/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug: store.store_slug,
          artworkId: artwork.id,
          variantId: selected?.id,
          sizeCode: selected?.size_code,
          frameOption: selected?.frame_option,
          quantity,
          customer: {
            name,
            phone,
            email: email || undefined,
            deliveryAddress: address,
            note,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start checkout");
      trackEvent(ANALYTICS_EVENTS.whatsappClicked, {
        storeSlug: store.store_slug,
        artworkId: artwork.id,
      });
      if (data.whatsappUrl) {
        // Open the artist's WhatsApp with the prefilled order message.
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
      router.push(`/s/${store.store_slug}/checkout/success?order=${encodeURIComponent(data.orderNumber)}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="mx-auto grid max-w-5xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="w-full rounded-2xl border border-zinc-100 object-cover dark:border-zinc-900"
        />
      </div>

      <div className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            {artwork.category ?? "Print"}
            {artwork.year_created ? ` · ${artwork.year_created}` : ""}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
            {artwork.title}
          </h1>
          {artwork.short_description ? (
            <p className="mt-2 text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
              {artwork.short_description}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone={artwork.is_limited_edition ? "info" : "neutral"}>
              {artwork.is_limited_edition ? `Limited edition${artwork.edition_size ? ` of ${artwork.edition_size}` : ""}` : "Open print"}
            </Badge>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              {formatCurrency(unitPrice, artwork.currency)}
            </span>
          </div>
        </header>

        {artwork.description ? (
          <section className="prose prose-sm max-w-none text-sm leading-6 text-zinc-700 dark:text-zinc-200">
            {artwork.description.split(/\n+/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          {variants.length > 0 ? (
            <FormField label="Size & frame" required>
              <Select
                value={variantId ?? ""}
                onChange={(e) => setVariantId(e.target.value)}
              >
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.size_label ?? v.size_code} · {v.frame_option} ·{" "}
                    {formatCurrency(Number(v.price), artwork.currency)}
                  </option>
                ))}
              </Select>
            </FormField>
          ) : null}
          <FormField label="Quantity" required>
            <Input
              type="number"
              min={1}
              max={20}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Your name" required>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </FormField>
            <FormField label="Phone (with country code)" required>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+234…"
              />
            </FormField>
          </div>
          <FormField label="Email (optional)">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <FormField label="Delivery address" required>
            <Textarea value={address} onChange={(e) => setAddress(e.target.value)} required />
          </FormField>
          <FormField label="Note for the artist">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
          </FormField>

          <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
            <div className="text-sm text-zinc-500">
              Total <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(total, artwork.currency)}</span>
            </div>
            <Button type="submit" loading={submitting}>
              Order on WhatsApp
            </Button>
          </div>
          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
              {error}
            </p>
          ) : null}
          <p className="text-xs text-zinc-500">
            We&apos;ll save your order and open WhatsApp so {store.artist_name} can confirm and arrange delivery.
          </p>
        </form>
      </div>
    </article>
  );
}
