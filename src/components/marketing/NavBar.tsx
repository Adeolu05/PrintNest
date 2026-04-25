"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, MenuIcon, SparklesIcon, XIcon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/demo", label: "Demo store" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all",
        scrolled
          ? "border-b border-zinc-100 bg-white/85 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" priority />
          <span className="hidden h-5 w-px bg-zinc-200 dark:bg-zinc-800 md:inline-block" />
          <Link
            href="/#whats-new"
            className="hidden items-center gap-1.5 rounded-full border border-blue-200/70 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200 md:inline-flex"
          >
            <SparklesIcon size={12} />
            New: AI captions for Instagram
            <ArrowRightIcon size={12} />
          </Link>
        </div>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100/70 hover:text-zinc-900 sm:inline-flex dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link href="/signup" className="hidden sm:inline-flex">
            <Button size="sm">
              Create my store
              <ArrowRightIcon size={14} />
            </Button>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-100 md:hidden dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden">
          <div
            className="fixed inset-0 top-16 z-40 bg-zinc-950/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 top-16 z-50 mx-3 mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
            <nav className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Sign in
              </Link>
            </nav>
            <div className="border-t border-zinc-100 p-2 pt-3 dark:border-zinc-900">
              <Link href="/signup" onClick={() => setOpen(false)}>
                <Button fullWidth>Create my store</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
