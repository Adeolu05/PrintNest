"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MAX_IMAGE_BYTES } from "@/lib/constants";

export type UploadResult = {
  imageUrl: string;
  width: number;
  height: number;
};

type Props = {
  initialUrl?: string | null;
  onUploaded: (result: UploadResult) => void;
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Client-side artwork uploader.
 *
 * Behaviour:
 * - Validates file type/size client-side before sending.
 * - Reads pixel dimensions via an in-memory Image element so the rest of the
 *   app can warn about print quality without round-tripping to the server.
 * - POSTs to /api/uploads/artwork which returns a hosted URL.
 *   In dev (without a configured storage bucket) the API returns a data URL
 *   so the UI keeps working end-to-end.
 */
export function ArtworkUploader({ initialUrl, onUploaded }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Use JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("That file is over 10MB. Try a smaller export.");
      return;
    }

    setBusy(true);
    try {
      const dimensions = await readImageDimensions(file);
      const dataUrl = await fileToDataUrl(file);
      setPreviewUrl(dataUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("width", String(dimensions.width));
      formData.append("height", String(dimensions.height));

      const res = await fetch("/api/uploads/artwork", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");

      onUploaded({
        imageUrl: data.url ?? dataUrl,
        width: dimensions.width,
        height: dimensions.height,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Upload failed";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center dark:border-zinc-700 dark:bg-zinc-900"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Artwork preview"
            className="max-h-72 w-auto rounded-xl border border-zinc-200 object-contain shadow-sm dark:border-zinc-800"
          />
        ) : (
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-xl font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            ↑
          </div>
        )}
        <p className="mt-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
          {previewUrl ? "Replace artwork file" : "Drop your artwork here"}
        </p>
        <p className="mt-1 text-xs text-zinc-500">JPG, PNG, or WEBP. Up to 10MB.</p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => inputRef.current?.click()}
          loading={busy}
        >
          {previewUrl ? "Choose another file" : "Upload artwork"}
        </Button>
        {error ? (
          <p className="mt-3 text-xs text-red-600">{error}</p>
        ) : null}
      </div>
    </div>
  );
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image dimensions"));
    };
    img.src = url;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
