"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3 transition-colors duration-200 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 ${
        scrolled ? "border-border/80 bg-background/80" : "border-transparent bg-transparent"
      }`}
    >
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
