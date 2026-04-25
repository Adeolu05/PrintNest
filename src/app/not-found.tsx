import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
        The page you tried to load doesn&apos;t exist.
      </p>
      <Link href="/" className="mt-6 text-sm font-medium underline">
        Go home
      </Link>
    </div>
  );
}
