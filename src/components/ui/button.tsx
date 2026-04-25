import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 dark:shadow-blue-500/30",
  secondary:
    "bg-blue-50 text-blue-700 hover:bg-blue-100 focus-visible:ring-blue-300 dark:bg-blue-500/15 dark:text-blue-200 dark:hover:bg-blue-500/25",
  ghost:
    "bg-transparent text-zinc-700 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-200 dark:text-zinc-200 dark:hover:bg-blue-500/10 dark:hover:text-blue-200",
  outline:
    "border border-zinc-200 bg-white text-zinc-900 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:ring-blue-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-blue-400/50 dark:hover:bg-blue-500/10 dark:hover:text-blue-100",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", fullWidth, loading, disabled, children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
