import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
            P
          </span>
          <span className="text-sm font-semibold tracking-tight">PrintNest</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
