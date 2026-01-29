"use client";

import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? "Light" : "Dark"} mode
    </Button>
  );
}
