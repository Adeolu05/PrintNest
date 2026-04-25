"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("PrintNest unhandled error", error);
    }
  }, [error]);
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">Something went wrong</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-white">
        We hit a snag rendering this page.
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
        Try again, or head back home. We've logged the issue.
      </p>
      <button
        onClick={reset}
        className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
      >
        Try again
      </button>
    </div>
  );
}
