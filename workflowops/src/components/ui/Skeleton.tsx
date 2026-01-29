import { HTMLAttributes } from "react";
import { cn } from "@/components/shared/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[var(--radius)] bg-border/60", className)}
      {...props}
    />
  );
}
