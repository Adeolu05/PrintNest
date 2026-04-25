import Link from "next/link";
import { notFound } from "next/navigation";
import { loadStorefront } from "@/server/services/storefront";
import { StoreFooter } from "@/components/storefront/StoreFooter";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const data = await loadStorefront(storeSlug);
  if (!data) notFound();
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <StorefrontTopBar storeName={data.store.store_name} storeSlug={data.store.store_slug} />
      <main className="flex-1">{children}</main>
      <StoreFooter store={data.store} />
    </div>
  );
}

function StorefrontTopBar({ storeName, storeSlug }: { storeName: string; storeSlug: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/80 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href={`/s/${storeSlug}`} className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-900 to-zinc-700 text-xs font-bold text-white dark:from-white dark:to-zinc-300 dark:text-zinc-900">
            {storeName.charAt(0)}
          </span>
          {storeName}
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-[11px] text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:hover:text-white"
        >
          Powered by <span className="font-semibold text-zinc-700 dark:text-zinc-200">PrintNest</span>
        </Link>
      </div>
    </header>
  );
}
