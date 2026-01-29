import { HTMLAttributes } from "react";
import { cn } from "@/components/shared/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger";

const variants: Record<BadgeVariant, string> = {
  default: "bg-card text-foreground border border-border",
  success: "bg-success/20 text-success border border-success/30",
  warning: "bg-warning/20 text-warning border border-warning/30",
  danger: "bg-danger/20 text-danger border border-danger/30",
};

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  const variant = (props as { variant?: BadgeVariant }).variant ?? "default";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
