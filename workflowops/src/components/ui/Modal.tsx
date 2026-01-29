"use client";

import { ReactNode } from "react";
import { cn } from "@/components/shared/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className={cn("w-full max-w-lg rounded-[var(--radius)] bg-card p-6 text-foreground shadow-[var(--shadow)]", className)}>
        <div className="mb-4 flex items-center justify-between">
          {title ? <h3 className="text-lg font-semibold">{title}</h3> : <span />}
          <button
            onClick={onClose}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
