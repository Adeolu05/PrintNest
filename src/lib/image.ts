import { MIN_DPI_FOR_PRINT, PRINT_SIZES } from "./constants";

export type RecommendedPrintSize = {
  code: string;
  label: string;
  estimatedDpi: number;
  isSafe: boolean;
};

/**
 * Given the pixel dimensions of an uploaded image, return print-size guidance
 * so artists know which sizes their file can support without visible blur.
 */
export function recommendPrintSizes(
  pixelWidth: number,
  pixelHeight: number,
  minDpi = MIN_DPI_FOR_PRINT,
): RecommendedPrintSize[] {
  return PRINT_SIZES.map((size) => {
    const dpiW = pixelWidth / size.widthIn;
    const dpiH = pixelHeight / size.heightIn;
    const dpi = Math.floor(Math.min(dpiW, dpiH));
    return {
      code: size.code,
      label: size.label,
      estimatedDpi: dpi,
      isSafe: dpi >= minDpi,
    };
  });
}

export function safestPrintSize(
  pixelWidth: number,
  pixelHeight: number,
  minDpi = MIN_DPI_FOR_PRINT,
) {
  const recs = recommendPrintSizes(pixelWidth, pixelHeight, minDpi);
  const last = recs.filter((r) => r.isSafe).pop();
  return last?.code ?? "A5";
}

export function qualityWarning(
  pixelWidth: number,
  pixelHeight: number,
): string | null {
  const recs = recommendPrintSizes(pixelWidth, pixelHeight);
  const safe = recs.filter((r) => r.isSafe).map((r) => r.code);
  if (safe.length === 0) {
    return "This image is small. It may look blurry even on small prints. Consider uploading a higher-resolution file (at least 1500 × 2100px).";
  }
  if (!safe.includes("A1")) {
    const largest = safe[safe.length - 1];
    return `This image is best up to ${largest}. Larger sizes may look soft when printed.`;
  }
  return null;
}
