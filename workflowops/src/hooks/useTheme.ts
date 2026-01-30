"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "workflowops-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof document !== "undefined") {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr === "light" || attr === "dark") {
        return attr;
      }
    }
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === "light" || stored === "dark") {
        return stored;
      }
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
  }

  function setThemeMode(mode: ThemeMode) {
    setTheme(mode);
  }

  return { theme, toggleTheme, setTheme: setThemeMode };
}
