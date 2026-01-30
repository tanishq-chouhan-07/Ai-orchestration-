"use client";

import { PropsWithChildren, useEffect } from "react";

const STORAGE_KEY = "workflowops-theme";

export default function ThemeProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const existing = document.documentElement.getAttribute("data-theme");
    if (existing === "light" || existing === "dark") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const theme = stored === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return children;
}
