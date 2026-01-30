"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="gap-2"
    >
      {isDark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
      <span className="text-xs uppercase tracking-wide text-muted">
        {isDark ? "Light" : "Dark"} mode
      </span>
    </Button>
  );
}
