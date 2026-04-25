import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ExternalLinkIcon } from "@/components/ui/icon";
import { SignOutButton } from "@/components/dashboard/SignOutButton";

export function Topbar({
  storeSlug,
  isPublished,
  email,
}: {
  storeSlug?: string | null;
  isPublished?: boolean;
  email?: string | null;
}) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/85 px-4 backdrop-blur sm:px-6 dark:border-zinc-900 dark:bg-zinc-950/85">
      <div className="flex items-center gap-3">
        {storeSlug ? (
          <Link
            href={`/s/${storeSlug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            View store
            <ExternalLinkIcon size={12} className="text-zinc-400" />
          </Link>
        ) : null}
        {storeSlug ? (
          <Badge tone={isPublished ? "success" : "warning"} dot>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-sm">
        {email ? (
          <div className="hidden items-center gap-2 sm:flex">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-semibold text-white">
              {email.slice(0, 2).toUpperCase()}
            </span>
            <span className="text-xs text-zinc-500">{email}</span>
          </div>
        ) : null}
        <SignOutButton />
      </div>
    </div>
  );
}
