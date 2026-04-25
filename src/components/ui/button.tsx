import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "subtle";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: [
    "bg-blue-600 text-white",
    "shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_8px_24px_-8px_rgba(37,99,235,0.55)]",
    "hover:bg-blue-700 active:bg-blue-700",
    "focus-visible:ring-blue-500/50",
    "dark:bg-blue-500 dark:hover:bg-blue-400",
  ].join(" "),
  secondary: [
    "bg-blue-50 text-blue-700 hover:bg-blue-100",
    "focus-visible:ring-blue-300",
    "dark:bg-blue-500/15 dark:text-blue-200 dark:hover:bg-blue-500/25",
  ].join(" "),
  ghost: [
    "bg-transparent text-zinc-700 hover:bg-zinc-100/80",
    "focus-visible:ring-zinc-300",
    "dark:text-zinc-200 dark:hover:bg-white/5",
  ].join(" "),
  outline: [
    "border border-zinc-200 bg-white text-zinc-900",
    "shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_1px_2px_rgba(15,23,42,0.04)]",
    "hover:border-zinc-300 hover:bg-zinc-50",
    "focus-visible:ring-zinc-300",
    "dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
  ].join(" "),
  subtle: [
    "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    "focus-visible:ring-zinc-300",
    "dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700",
  ].join(" "),
  danger: [
    "bg-red-600 text-white hover:bg-red-700",
    "shadow-[0_8px_24px_-8px_rgba(220,38,38,0.55)]",
    "focus-visible:ring-red-500/50",
  ].join(" "),
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
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
          "group relative inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-tight",
          "transition-[transform,background-color,box-shadow,color] duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
          "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
