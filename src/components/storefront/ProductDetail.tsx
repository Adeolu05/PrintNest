"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, FormField, Select } from "@/components/ui/input";
import {
  CheckCircleIcon,
  HeartIcon,
  ShieldIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/ui/icon";
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
  const [showOrderForm, setShowOrderForm] = useState(false);
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
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-zinc-500">
        <ol className="flex items-center gap-1.5">
          <li><a href={`/s/${store.store_slug}`} className="hover:text-zinc-900 dark:hover:text-white">{store.store_name}</a></li>
          <li aria-hidden>/</li>
          <li className="text-zinc-700 dark:text-zinc-200">{artwork.title}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Image column */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-100 shadow-sm dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full object-cover"
            />
            {artwork.is_limited_edition ? (
              <div className="absolute left-4 top-4">
                <Badge tone="brand">
                  Limited{artwork.edition_size ? ` · ${(artwork.edition_size - (artwork.edition_sold ?? 0))} left of ${artwork.edition_size}` : ""}
                </Badge>
              </div>
            ) : null}
          </div>
          {/* Mock thumbnail strip - acts like a gallery preview */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`relative aspect-square w-20 overflow-hidden rounded-xl border ${
                  i === 0 ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-800"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artwork.thumbnail_url ?? artwork.image_url}
                  alt=""
                  className={`h-full w-full object-cover ${i > 0 ? "opacity-60" : ""}`}
                />
                {i > 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 text-[10px] font-medium text-zinc-500 backdrop-blur-sm dark:bg-zinc-950/40">
                    {i === 1 ? "Mockup" : "In room"}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Details column */}
        <div className="space-y-6">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {artwork.category ?? "Print"}
              {artwork.year_created ? ` · ${artwork.year_created}` : ""}
              {artwork.medium ? ` · ${artwork.medium}` : ""}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-[40px] sm:leading-[1.05] dark:text-white">
              {artwork.title}
            </h1>
            {artwork.short_description ? (
              <p className="mt-3 text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
                {artwork.short_description}
              </p>
            ) : null}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                {formatCurrency(unitPrice, artwork.currency)}
              </span>
              {selected ? (
                <span className="text-sm text-zinc-500">{selected.size_label ?? selected.size_code} · {selected.frame_option}</span>
              ) : null}
            </div>
          </header>

          {/* Quick actions / order panel */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            {variants.length > 0 ? (
              <FormField label="Size & frame" required>
                <Select
                  value={variantId ?? ""}
                  onChange={(e) => setVariantId(e.target.value)}
                >
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.size_label ?? v.size_code} · {v.frame_option} · {formatCurrency(Number(v.price), artwork.currency)}
                    </option>
                  ))}
                </Select>
              </FormField>
            ) : null}
            <div className="mt-3 flex items-end gap-3">
              <FormField label="Qty" required>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-24"
                />
              </FormField>
              <div className="ml-auto text-right">
                <p className="text-xs text-zinc-500">Total</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {formatCurrency(total, artwork.currency)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="lg"
              fullWidth
              className="mt-4 bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500/40"
              onClick={() => setShowOrderForm(true)}
            >
              <WhatsAppIcon size={18} />
              {showOrderForm ? "Fill in your details below" : "Order on WhatsApp"}
            </Button>
            <button
              type="button"
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              <HeartIcon size={13} /> Save for later
            </button>
          </div>

          {/* Description */}
          {artwork.description ? (
            <section className="space-y-2 text-sm leading-6 text-zinc-700 dark:text-zinc-200">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">About this piece</h2>
              {artwork.description.split(/\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </section>
          ) : null}

          {/* Trust signals */}
          <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <TrustRow icon={<WhatsAppIcon size={14} />} text={`Order direct from ${store.artist_name} via WhatsApp`} />
            <TrustRow icon={<ShieldIcon size={14} />} text="Authentic, signed by the artist" />
            <TrustRow icon={<TruckIcon size={14} />} text="Worldwide shipping arranged per order" />
            {artwork.is_limited_edition ? (
              <TrustRow icon={<CheckCircleIcon size={14} />} text={`Limited edition${artwork.edition_size ? ` of ${artwork.edition_size}` : ""}`} />
            ) : null}
          </div>

          {/* Order form (revealed) */}
          {showOrderForm ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950 animate-fade-in-up"
            >
              <p className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">Your details</p>
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
              <Button type="submit" loading={submitting} fullWidth size="lg" className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500/40">
                <WhatsAppIcon size={16} />
                Send order on WhatsApp · {formatCurrency(total, artwork.currency)}
              </Button>
              {error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
                  {error}
                </p>
              ) : null}
              <p className="text-xs text-zinc-500">
                We&apos;ll save your order and open WhatsApp so {store.artist_name} can confirm and arrange delivery.
              </p>
            </form>
          ) : null}
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-zinc-500">{selected ? selected.size_label ?? selected.size_code : "Print"}</p>
            <p className="text-base font-semibold text-zinc-900 dark:text-white">{formatCurrency(total, artwork.currency)}</p>
          </div>
          <Button
            type="button"
            size="md"
            className="bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500/40"
            onClick={() => {
              setShowOrderForm(true);
              if (typeof document !== "undefined") {
                document.querySelector("form")?.scrollIntoView({ behavior: "smooth", block: "center" });
              }
            }}
          >
            <WhatsAppIcon size={16} />
            Order
          </Button>
        </div>
      </div>
    </article>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
        {icon}
      </span>
      {text}
    </div>
  );
}
