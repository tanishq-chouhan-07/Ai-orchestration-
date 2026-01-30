import { HTMLAttributes } from "react";
import { cn } from "@/components/shared/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-[var(--radius)]", className)}
      {...props}
    />
  );
}
