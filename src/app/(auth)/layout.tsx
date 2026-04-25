import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CheckCircleIcon, QuoteIcon, SparklesIcon } from "@/components/ui/icon";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left: form column */}
        <div className="relative flex flex-col">
          <header className="flex items-center justify-between px-6 py-5 sm:px-10">
            <Logo size="md" priority />
            <Link
              href="/"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              ← Back to site
            </Link>
          </header>
          <main className="flex flex-1 items-center justify-center px-4 pb-16 pt-4 sm:px-10">
            <div className="w-full max-w-sm">{children}</div>
          </main>
          <footer className="px-6 py-5 text-xs text-zinc-400 sm:px-10">
            © {new Date().getFullYear()} PrintNest
          </footer>
        </div>

        {/* Right: showcase column */}
        <ShowcasePanel />
      </div>
    </div>
  );
}

function ShowcasePanel() {
  return (
    <aside className="relative isolate hidden overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 lg:block">
      <div aria-hidden className="pointer-events-none absolute -left-20 -top-32 h-80 w-80 rounded-full bg-white/15 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-300/15 blur-3xl" />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-[0.18]" />

      <div className="relative flex h-full flex-col justify-between p-10 text-white">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium backdrop-blur">
            <SparklesIcon size={12} /> Welcome to PrintNest
          </span>
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Your art deserves a storefront that feels as good as it looks.
          </h2>
          <ul className="space-y-3 text-sm text-blue-50/90">
            {[
              "Upload artwork in any size — we optimise it for print.",
              "AI writes titles, descriptions, captions, and SEO copy.",
              "Share one link. Receive structured WhatsApp orders.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <CheckCircleIcon size={18} className="mt-0.5 text-white" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Floating preview card */}
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 mx-auto max-w-md">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
              <QuoteIcon size={22} className="text-white/70" />
              <p className="mt-3 text-sm leading-6">
                I uploaded eight pieces over breakfast. By lunch I had a live store and my first WhatsApp order.
              </p>
              <div className="mt-4 flex items-center gap-3 border-t border-white/15 pt-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                  TA
                </span>
                <div>
                  <p className="text-sm font-semibold">Tola Adebayo</p>
                  <p className="text-xs text-blue-100/80">Painter · Lagos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-32" />
        </div>
      </div>
    </aside>
  );
}
