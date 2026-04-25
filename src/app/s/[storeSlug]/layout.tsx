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
    <header className="border-b border-zinc-100 bg-white/85 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href={`/s/${storeSlug}`} className="text-sm font-semibold tracking-tight">
          {storeName}
        </a>
        <a
          href="/"
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          Powered by PrintNest
        </a>
      </div>
    </header>
  );
}
