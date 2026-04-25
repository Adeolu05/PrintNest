"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import {
  HomeIcon,
  ImageIcon,
  LayoutIcon,
  PackageIcon,
  SettingsIcon,
  SparklesIcon,
} from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
};

const ITEMS: Item[] = [
  { href: "/dashboard", label: "Dashboard", icon: <HomeIcon size={18} /> },
  { href: "/dashboard/artworks", label: "Artworks", icon: <ImageIcon size={18} /> },
  { href: "/dashboard/orders", label: "Orders", icon: <PackageIcon size={18} /> },
  { href: "/dashboard/storefront", label: "Storefront", icon: <LayoutIcon size={18} /> },
  { href: "/dashboard/ai-studio", label: "AI Studio", icon: <SparklesIcon size={18} />, badge: "New" },
  { href: "/dashboard/settings", label: "Settings", icon: <SettingsIcon size={18} /> },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-zinc-200 bg-white px-4 py-5 lg:flex lg:flex-col dark:border-zinc-900 dark:bg-zinc-950">
      <div className="px-2">
        <Logo size="md" />
      </div>
      <nav className="mt-8 flex-1 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          Workspace
        </p>
        {ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-blue-50 font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-200"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-colors",
                  active
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-500/25 dark:text-blue-200"
                    : "bg-transparent text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200",
                )}
              >
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
              {active ? (
                <span aria-hidden className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:border-blue-500/30 dark:from-blue-500/10 dark:to-indigo-500/10">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
          <SparklesIcon size={14} />
          <p className="text-xs font-semibold">Pro tip</p>
        </div>
        <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-300">
          Set your tone in <Link href="/dashboard/ai-studio" className="font-medium text-blue-700 underline-offset-2 hover:underline dark:text-blue-200">AI Studio</Link> to get on-brand captions every time.
        </p>
      </div>
    </aside>
  );
}

export function MobileTabs() {
  const pathname = usePathname();
  const items = ITEMS.slice(0, 5);
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-blue-600 dark:text-blue-300" : "text-zinc-500",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center",
                  active && "scale-110",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
