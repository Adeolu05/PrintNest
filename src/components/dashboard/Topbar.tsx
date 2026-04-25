import Link from "next/link";
import { Badge } from "@/components/ui/badge";
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
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-100 bg-white px-4 sm:px-6 dark:border-zinc-900 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        {storeSlug ? (
          <Link
            href={`/s/${storeSlug}`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            View store
            <span className="text-zinc-400">↗</span>
          </Link>
        ) : null}
        {storeSlug ? (
          <Badge tone={isPublished ? "success" : "warning"}>
            {isPublished ? "Published" : "Draft"}
          </Badge>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-sm">
        {email ? (
          <span className="hidden text-xs text-zinc-500 sm:inline">{email}</span>
        ) : null}
        <SignOutButton />
      </div>
    </div>
  );
}
