import Link from "next/link";
import type { StoreRow } from "@/server/repositories/stores";
import { ShieldIcon, TruckIcon, WhatsAppIcon } from "@/components/ui/icon";

export function StoreFooter({ store }: { store: StoreRow }) {
  return (
    <footer className="border-t border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 text-sm sm:px-6 sm:grid-cols-3">
        <TrustItem
          icon={<WhatsAppIcon size={16} />}
          title="Direct from the artist"
          body="Orders go straight to the artist via WhatsApp."
        />
        <TrustItem
          icon={<ShieldIcon size={16} />}
          title="Authentic prints"
          body="Each print is produced and signed by the artist."
        />
        <TrustItem
          icon={<TruckIcon size={16} />}
          title="Worldwide shipping"
          body="Shipping arranged with you on a per-order basis."
        />
      </div>
      <div className="border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:px-6">
          <p>
            © {new Date().getFullYear()} {store.artist_name} · Built with{" "}
            <Link href="/" className="font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-200">
              PrintNest
            </Link>
          </p>
          <p className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Store live & accepting orders
          </p>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{body}</p>
      </div>
    </div>
  );
}
