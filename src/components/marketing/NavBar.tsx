import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/85 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo size="sm" priority />
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          <Link href="/demo" className="hover:text-blue-600 dark:hover:text-blue-300">Demo store</Link>
          <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-300">Pricing</Link>
          <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-300">Sign in</Link>
        </nav>
        <Link
          href="/signup"
          className="inline-flex h-9 items-center justify-center rounded-full bg-blue-600 px-4 text-xs font-medium text-white shadow-sm shadow-blue-600/25 transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
        >
          Create my store
        </Link>
      </div>
    </header>
  );
}
