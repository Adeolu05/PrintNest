import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, TikTokIcon, XSocialIcon } from "@/components/ui/icon";

export function Footer() {
  return (
    <footer className="relative border-t border-zinc-100 bg-zinc-50/50 dark:border-zinc-900 dark:bg-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent dark:via-blue-500/40"
      />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 text-sm text-zinc-600 sm:px-6 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo size="md" />
          <p className="mt-3 max-w-xs text-sm text-zinc-500">
            The fastest way for visual artists to turn artwork into a sellable print store. Free to start, beautiful by default.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink href="https://instagram.com" label="Instagram"><InstagramIcon size={16} /></SocialLink>
            <SocialLink href="https://tiktok.com" label="TikTok"><TikTokIcon size={16} /></SocialLink>
            <SocialLink href="https://x.com" label="X"><XSocialIcon size={16} /></SocialLink>
          </div>
        </div>
        <FooterColumn
          title="Product"
          items={[
            { label: "Demo store", href: "/demo" },
            { label: "Pricing", href: "/pricing" },
            { label: "Sign up", href: "/signup" },
            { label: "Sign in", href: "/login" },
          ]}
        />
        <FooterColumn
          title="Resources"
          items={[
            { label: "AI guidelines", href: "/pricing" },
            { label: "Print sizes", href: "/pricing" },
            { label: "Brand kit", href: "/pricing" },
          ]}
        />
        <FooterColumn
          title="Company"
          items={[
            { label: "Terms", href: "/pricing" },
            { label: "Privacy", href: "/pricing" },
            { label: "Contact", href: "/pricing" },
          ]}
        />
      </div>
      <div className="border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:px-6">
          <p>© {new Date().getFullYear()} PrintNest. Built for independent artists.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-200"
    >
      {children}
    </a>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="md:col-span-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-200">{title}</h4>
      <ul className="mt-3 space-y-2 text-zinc-500">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="hover:text-blue-600 dark:hover:text-blue-300">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
