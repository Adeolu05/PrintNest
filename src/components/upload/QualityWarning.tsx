import { qualityWarning, recommendPrintSizes } from "@/lib/image";

export function QualityWarning({ width, height }: { width: number; height: number }) {
  const warning = qualityWarning(width, height);
  const recs = recommendPrintSizes(width, height);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">Print quality</p>
      <p className="mt-1 text-xs text-zinc-500">
        Uploaded at {width.toLocaleString()} × {height.toLocaleString()}px.
      </p>
      <ul className="mt-3 grid gap-1 text-xs sm:grid-cols-5">
        {recs.map((r) => (
          <li
            key={r.code}
            className={
              r.isSafe
                ? "rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                : "rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
            }
          >
            <span className="block font-medium">{r.code}</span>
            <span>{r.estimatedDpi} dpi</span>
          </li>
        ))}
      </ul>
      {warning ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {warning}
        </p>
      ) : (
        <p className="mt-3 text-xs text-emerald-600">This file looks great for print.</p>
      )}
    </div>
  );
}
