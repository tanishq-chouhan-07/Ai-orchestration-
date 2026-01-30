import { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/components/shared/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "bg-card text-foreground border border-border",
  success: "bg-success/20 text-success border border-success/30 shadow-[0_0_12px_rgba(34,197,94,0.25)]",
  warning: "bg-warning/20 text-warning border border-warning/30",
  danger: "bg-danger/20 text-danger border border-danger/30",
};

export function Badge({ className, variant = "default", children, ...props }: PropsWithChildren<
  HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }
>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {variant === "success" && (
        <span className="relative mr-2 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
      )}
      {children}
    </span>
  );
}
