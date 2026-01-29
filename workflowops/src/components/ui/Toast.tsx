import { HTMLAttributes } from "react";
import { cn } from "@/components/shared/cn";

type ToastVariant = "default" | "success" | "warning" | "danger";

const variants: Record<ToastVariant, string> = {
  default: "border-border bg-card text-foreground",
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-warning/40 bg-warning/10 text-warning",
  danger: "border-danger/40 bg-danger/10 text-danger",
};

export function Toast({ className, ...props }: HTMLAttributes<HTMLDivElement> & { variant?: ToastVariant }) {
  const variant = (props as { variant?: ToastVariant }).variant ?? "default";
  return (
    <div
      className={cn(
        "w-full rounded-[var(--radius)] border px-4 py-3 text-sm shadow-[var(--shadow)]",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
