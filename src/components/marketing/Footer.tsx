import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 text-sm text-zinc-600 sm:px-6 md:grid-cols-4">
        <div>
          <Logo size="md" />
          <p className="mt-3 max-w-xs text-xs text-zinc-500">
            The fastest way for visual artists to turn artwork into sellable print pages.
          </p>
        </div>
        <FooterColumn
          title="Product"
          items={[
            { label: "Demo store", href: "/demo" },
            { label: "Pricing", href: "/pricing" },
            { label: "Sign up", href: "/signup" },
          ]}
        />
        <FooterColumn
          title="Resources"
          items={[
            { label: "AI guidelines", href: "/pricing" },
            { label: "Print sizes", href: "/pricing" },
          ]}
        />
        <FooterColumn
          title="Legal"
          items={[
            { label: "Terms", href: "/pricing" },
            { label: "Privacy", href: "/pricing" },
          ]}
        />
      </div>
      <div className="border-t border-zinc-100 py-4 text-center text-xs text-zinc-500 dark:border-zinc-900">
        © {new Date().getFullYear()} PrintNest. Built for independent artists.
      </div>
    </footer>
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
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-200">{title}</h4>
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
