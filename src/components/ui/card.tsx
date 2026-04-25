import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  interactive,
}: {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/80 bg-white",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_1px_2px_rgba(15,23,42,0.04)]",
        "dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_8px_24px_-8px_rgba(15,23,42,0.15)] dark:hover:border-zinc-700",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("border-b border-zinc-100 px-5 py-4 dark:border-zinc-900", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("mt-1 text-sm text-zinc-500", className)}>{children}</p>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-5", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between gap-3 border-t border-zinc-100 px-5 py-3 dark:border-zinc-900", className)}>{children}</div>;
}
