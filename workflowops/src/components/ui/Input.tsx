import { InputHTMLAttributes } from "react";
import { cn } from "@/components/shared/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30",
        className
      )}
      {...props}
    />
  );
}
