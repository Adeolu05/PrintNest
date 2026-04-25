import Link from "next/link";
import type { StoreRow } from "@/server/repositories/stores";

export function StoreFooter({ store }: { store: StoreRow }) {
  return (
    <footer className="border-t border-zinc-100 bg-zinc-50 py-10 dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 text-xs text-zinc-500 sm:px-6">
        <p>
          © {new Date().getFullYear()} {store.artist_name} · Built with{" "}
          <Link href="/" className="font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-200">
            PrintNest
          </Link>
        </p>
        <p>
          Shipping & payment handled by the artist via WhatsApp.
        </p>
      </div>
    </footer>
  );
}
