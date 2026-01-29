import { HTMLAttributes } from "react";
import { cn } from "@/components/shared/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius)] border border-border bg-card p-6 shadow-[var(--shadow)]",
        className
      )}
      {...props}
    />
  );
}
