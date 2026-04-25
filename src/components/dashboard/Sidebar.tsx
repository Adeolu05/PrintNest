"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/artworks", label: "Artworks" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/storefront", label: "Storefront" },
  { href: "/dashboard/ai-studio", label: "AI Studio" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-100 bg-white px-4 py-6 lg:block dark:border-zinc-900 dark:bg-zinc-950">
      <Link href="/" className="flex items-center gap-2 px-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
          P
        </span>
        <span className="text-sm font-semibold tracking-tight">PrintNest</span>
      </Link>
      <nav className="mt-8 space-y-1">
        {ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900",
              )}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileTabs() {
  const pathname = usePathname();
  const items = ITEMS.slice(0, 4);
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-zinc-100 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.04)] lg:hidden dark:border-zinc-800 dark:bg-zinc-950">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 py-3 text-center text-xs font-medium",
              active ? "text-zinc-900 dark:text-white" : "text-zinc-500",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
