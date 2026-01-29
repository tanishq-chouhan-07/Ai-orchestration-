"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "workflowops-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggleTheme() {
    const next: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
  }

  function setThemeMode(mode: ThemeMode) {
    setTheme(mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute("data-theme", mode);
  }

  return { theme, toggleTheme, setTheme: setThemeMode };
}
