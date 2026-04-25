import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SIZE_HEIGHTS = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
  xl: "h-16",
} as const;

type LogoProps = {
  href?: string | null;
  className?: string;
  size?: keyof typeof SIZE_HEIGHTS;
  priority?: boolean;
  ariaLabel?: string;
};

export function Logo({
  href = "/",
  className,
  size = "sm",
  priority,
  ariaLabel = "PrintNest",
}: LogoProps) {
  const mark = (
    <span
      className={cn(
        "relative inline-block overflow-hidden rounded-md shadow-sm ring-1 ring-zinc-200/70 dark:ring-zinc-800/80",
        SIZE_HEIGHTS[size],
        className,
      )}
      style={{ aspectRatio: "1024 / 558" }}
    >
      <Image
        src="/printnest-logo.jpg"
        alt={ariaLabel}
        fill
        priority={priority}
        sizes="(max-width: 768px) 160px, 220px"
        className="object-cover"
      />
    </span>
  );

  if (!href) return mark;

  return (
    <Link href={href} aria-label={ariaLabel} className="inline-flex items-center">
      {mark}
    </Link>
  );
}
