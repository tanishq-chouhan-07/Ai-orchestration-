"use client";

import { useCallback, useEffect, useState } from "react";

type AuthUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, error: null });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        setState({ user: null, loading: false, error: "Unauthorized" });
        return;
      }
      const data = (await response.json()) as { user: AuthUser };
      setState({ user: data.user ?? null, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: "Failed to load user" });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
