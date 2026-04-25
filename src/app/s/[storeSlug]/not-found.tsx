import Link from "next/link";

export default function StoreNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        We couldn&apos;t find that storefront.
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        The artist may have unpublished it, or the link could be wrong. Try going home or starting your own store.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="text-sm font-medium underline">Home</Link>
        <Link href="/signup" className="text-sm font-medium underline">Create your store</Link>
      </div>
    </div>
  );
}
