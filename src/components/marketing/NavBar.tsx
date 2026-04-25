import Link from "next/link";

export function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-100 bg-white/85 backdrop-blur dark:border-zinc-900 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
            P
          </span>
          <span className="text-sm font-semibold tracking-tight">PrintNest</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
          <Link href="/demo" className="hover:text-zinc-900 dark:hover:text-white">Demo store</Link>
          <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-white">Pricing</Link>
          <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white">Sign in</Link>
        </nav>
        <Link
          href="/signup"
          className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-900 px-4 text-xs font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900"
        >
          Create my store
        </Link>
      </div>
    </header>
  );
}
