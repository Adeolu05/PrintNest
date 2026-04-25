"use client";

import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { FRAME_OPTIONS, PRINT_SIZES } from "@/lib/constants";

export type VariantDraft = {
  id?: string;
  sizeCode: string;
  frameOption: string;
  price: number;
  stockQuantity?: number | null;
};

type Props = {
  variants: VariantDraft[];
  onChange: (next: VariantDraft[]) => void;
  currency: string;
};

export function VariantsEditor({ variants, onChange, currency }: Props) {
  function update(index: number, patch: Partial<VariantDraft>) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }
  function remove(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }
  function add() {
    onChange([
      ...variants,
      { sizeCode: "A4", frameOption: "No frame", price: 0, stockQuantity: null },
    ]);
  }

  return (
    <div className="space-y-3">
      {variants.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Add at least one print size. Buyers pick from the sizes you set here.
        </p>
      ) : null}
      <div className="space-y-2">
        {variants.map((variant, i) => (
          <div
            key={i}
            className="grid gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 sm:grid-cols-[1.1fr_1.1fr_1fr_0.9fr_auto] dark:border-zinc-800 dark:bg-zinc-950"
          >
            <Select
              value={variant.sizeCode}
              onChange={(e) => update(i, { sizeCode: e.target.value })}
            >
              {PRINT_SIZES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.label}
                </option>
              ))}
            </Select>
            <Select
              value={variant.frameOption}
              onChange={(e) => update(i, { frameOption: e.target.value })}
            >
              {FRAME_OPTIONS.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </Select>
            <Input
              type="number"
              min={0}
              step={1}
              value={variant.price}
              onChange={(e) => update(i, { price: Number(e.target.value) })}
              placeholder={`Price (${currency})`}
            />
            <Input
              type="number"
              min={0}
              step={1}
              value={variant.stockQuantity ?? ""}
              onChange={(e) =>
                update(i, {
                  stockQuantity: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder="Stock"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(i)}
              aria-label="Remove variant"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        Add print size
      </Button>
    </div>
  );
}
