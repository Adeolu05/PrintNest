"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input, Select, Textarea } from "@/components/ui/input";
import { ArtworkUploader, type UploadResult } from "@/components/upload/ArtworkUploader";
import { QualityWarning } from "@/components/upload/QualityWarning";
import { AIGenerationPanel, type AIGeneratedDraft } from "@/components/ai/AIGenerationPanel";
import { VariantsEditor, type VariantDraft } from "@/components/dashboard/VariantsEditor";
import { PRINT_CATEGORIES, SUPPORTED_CURRENCIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

export type ArtworkFormInitial = {
  id?: string;
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  medium?: string;
  yearCreated?: number | null;
  tags?: string[];
  basePrice?: number;
  currency?: string;
  isLimitedEdition?: boolean;
  editionSize?: number | null;
  imageUrl?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  isPublished?: boolean;
  variants?: VariantDraft[];
  aiCaption?: string;
};

type Props = {
  storeCurrency: string;
  initial?: ArtworkFormInitial;
};

export function ArtworkForm({ storeCurrency, initial }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Abstract");
  const [medium, setMedium] = useState(initial?.medium ?? "");
  const [yearCreated, setYearCreated] = useState<number | "">(initial?.yearCreated ?? "");
  const [tags, setTags] = useState<string>(initial?.tags?.join(", ") ?? "");
  const [basePrice, setBasePrice] = useState<number>(initial?.basePrice ?? 0);
  const [currency, setCurrency] = useState(initial?.currency ?? storeCurrency);
  const [isLimitedEdition, setIsLimitedEdition] = useState(Boolean(initial?.isLimitedEdition));
  const [editionSize, setEditionSize] = useState<number | "">(initial?.editionSize ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);
  const [imageDims, setImageDims] = useState<{ width: number; height: number } | null>(
    initial?.imageWidth && initial?.imageHeight
      ? { width: initial.imageWidth, height: initial.imageHeight }
      : null,
  );
  const [variants, setVariants] = useState<VariantDraft[]>(initial?.variants ?? []);
  const [aiCaption, setAiCaption] = useState(initial?.aiCaption ?? "");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [altText, setAltText] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [isPublished, setIsPublished] = useState(Boolean(initial?.isPublished));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const finalSlug = useMemo(
    () => slugify(slugTouched && slug ? slug : title),
    [title, slug, slugTouched],
  );

  function handleUploaded(result: UploadResult) {
    setImageUrl(result.imageUrl);
    setImageDims({ width: result.width, height: result.height });
  }

  function applyDraft(draft: AIGeneratedDraft) {
    if (!title) setTitle(draft.title);
    setShortDescription(draft.shortDescription);
    setDescription(draft.longDescription);
    setSeoTitle(draft.seoTitle);
    setSeoDescription(draft.seoDescription);
    setAltText(draft.altText);
    setWhatsappMessage(draft.whatsappMessage);
    setAiCaption(draft.instagramCaption);
    if (!tags && draft.tags?.length) setTags(draft.tags.join(", "));
    if (draft.suggestedPriceRange && (!basePrice || basePrice === 0)) {
      const mid = Math.round(
        (draft.suggestedPriceRange.low + draft.suggestedPriceRange.high) / 2,
      );
      setBasePrice(mid);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!imageUrl) {
      setError("Upload an artwork file first.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: finalSlug || undefined,
        shortDescription,
        description,
        category,
        medium,
        yearCreated: yearCreated === "" ? undefined : Number(yearCreated),
        tags: tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        basePrice: Number(basePrice) || 0,
        currency,
        isLimitedEdition,
        editionSize: editionSize === "" ? undefined : Number(editionSize),
        imageUrl,
        imageWidth: imageDims?.width,
        imageHeight: imageDims?.height,
        isPublished,
        variants: variants.map((v) => ({
          id: v.id,
          sizeCode: v.sizeCode,
          frameOption: v.frameOption,
          price: Number(v.price) || 0,
          stockQuantity:
            v.stockQuantity === null || v.stockQuantity === undefined
              ? null
              : Number(v.stockQuantity),
        })),
        aiCaption,
        seoTitle,
        seoDescription,
        altText,
        whatsappMessage,
      };
      const url = initial?.id ? `/api/artworks/${initial.id}` : "/api/artworks";
      const method = initial?.id ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save artwork");
      router.push("/dashboard/artworks");
      router.refresh();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Could not save artwork";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload artwork</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <ArtworkUploader initialUrl={imageUrl} onUploaded={handleUploaded} />
            {imageDims ? (
              <QualityWarning width={imageDims.width} height={imageDims.height} />
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <FormField label="Title" required>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Lagos Ember Flow"
              />
            </FormField>
            <FormField
              label="Slug"
              hint={`Will appear at /s/your-store/art/${finalSlug || "your-slug"}`}
            >
              <Input
                value={slugTouched ? slug : finalSlug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(slugify(e.target.value));
                }}
                placeholder="lagos-ember-flow"
              />
            </FormField>
            <div className="grid gap-3 md:grid-cols-3">
              <FormField label="Category">
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  {PRINT_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Medium">
                <Input
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="Digital, oil, mixed media…"
                />
              </FormField>
              <FormField label="Year">
                <Input
                  type="number"
                  min={1800}
                  max={2100}
                  value={yearCreated}
                  onChange={(e) =>
                    setYearCreated(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </FormField>
            </div>
            <FormField label="Short description (1-2 sentences)">
              <Textarea
                value={shortDescription}
                maxLength={280}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </FormField>
            <FormField label="Long description">
              <Textarea
                value={description}
                maxLength={4000}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[160px]"
              />
            </FormField>
            <div className="grid gap-3 md:grid-cols-2">
              <FormField label="Tags (comma separated)">
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="abstract, lagos, modern" />
              </FormField>
              <FormField label="Alt text (accessibility)">
                <Input value={altText} onChange={(e) => setAltText(e.target.value)} />
              </FormField>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & sizes</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <FormField label="Base price" hint="Used as a fallback when no variant is chosen.">
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                />
              </FormField>
              <FormField label="Currency">
                <Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Limited edition?">
                <div className="flex h-10 items-center gap-2 rounded-lg border border-zinc-200 px-3 dark:border-zinc-800">
                  <input
                    id="limited-edition"
                    type="checkbox"
                    checked={isLimitedEdition}
                    onChange={(e) => setIsLimitedEdition(e.target.checked)}
                  />
                  <label htmlFor="limited-edition" className="text-sm">
                    Mark as limited edition
                  </label>
                </div>
              </FormField>
            </div>
            {isLimitedEdition ? (
              <FormField label="Edition size">
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={editionSize}
                  onChange={(e) =>
                    setEditionSize(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  placeholder="e.g. 25"
                />
              </FormField>
            ) : null}
            <VariantsEditor variants={variants} onChange={setVariants} currency={currency} />
          </CardBody>
        </Card>
      </div>

      <div className="space-y-6">
        <AIGenerationPanel
          imageUrl={imageUrl}
          defaultCategory={category}
          defaultMedium={medium}
          onGenerated={applyDraft}
        />

        <Card>
          <CardHeader>
            <CardTitle>SEO & social</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <FormField label="SEO title">
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} />
            </FormField>
            <FormField label="SEO description">
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                maxLength={170}
              />
            </FormField>
            <FormField label="Instagram caption">
              <Textarea
                value={aiCaption}
                onChange={(e) => setAiCaption(e.target.value)}
                maxLength={320}
              />
            </FormField>
            <FormField label="WhatsApp sales message">
              <Textarea
                value={whatsappMessage}
                onChange={(e) => setWhatsappMessage(e.target.value)}
                maxLength={600}
              />
            </FormField>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                className="mt-1"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <span>
                <span className="font-medium text-zinc-900 dark:text-white">Published</span>
                <span className="block text-xs text-zinc-500">
                  Buyers can see and order this artwork on your storefront.
                </span>
              </span>
            </label>
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
                {error}
              </p>
            ) : null}
            <Button type="submit" loading={submitting} fullWidth size="lg">
              {initial?.id ? "Save changes" : "Save artwork"}
            </Button>
          </CardBody>
        </Card>
      </div>
    </form>
  );
}
