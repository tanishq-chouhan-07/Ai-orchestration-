"use client";

import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
      <div>
        <p className="text-xs uppercase text-muted">WorkflowOps</p>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right text-xs text-muted">
          <div>{user?.name ?? user?.email ?? "User"}</div>
          <div className="uppercase">{user?.role ?? "viewer"}</div>
        </div>
        <ThemeToggle />
        <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
