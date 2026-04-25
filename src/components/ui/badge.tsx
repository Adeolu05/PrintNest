import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";
type Size = "sm" | "md";

const TONES: Record<Tone, string> = {
  neutral:
    "bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800/70 dark:text-zinc-200 dark:ring-zinc-700",
  success:
    "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:ring-emerald-800/70",
  warning:
    "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:ring-amber-800/70",
  danger:
    "bg-red-50 text-red-800 ring-1 ring-inset ring-red-200 dark:bg-red-900/30 dark:text-red-200 dark:ring-red-800/70",
  info:
    "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-800/70",
  brand:
    "bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-1 ring-inset ring-white/10 shadow-sm",
};

const SIZES: Record<Size, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
};

export function Badge({
  tone = "neutral",
  size = "md",
  className,
  children,
  dot,
}: {
  tone?: Tone;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        SIZES[size],
        TONES[tone],
        className,
      )}
    >
      {dot ? (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-emerald-500",
            tone === "warning" && "bg-amber-500",
            tone === "danger" && "bg-red-500",
            tone === "info" && "bg-blue-500",
            tone === "neutral" && "bg-zinc-400",
            tone === "brand" && "bg-white",
          )}
        />
      ) : null}
      {children}
    </span>
  );
}
