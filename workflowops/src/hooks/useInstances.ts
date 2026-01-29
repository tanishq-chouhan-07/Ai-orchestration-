"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { instancesResponseSchema } from "@/lib/api-contracts";

export type Instance = z.infer<typeof instancesResponseSchema>[
  "data"
][number];

type InstancesState = {
  data: Instance[];
  loading: boolean;
  error: string | null;
};

export function useInstances() {
  const [state, setState] = useState<InstancesState>({
    data: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch("/api/instances", { cache: "no-store" });
      if (!response.ok) {
        setState({ data: [], loading: false, error: "Failed to load instances." });
        return;
      }
      const payload = instancesResponseSchema.parse(await response.json());
      setState({ data: payload.data, loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: "Failed to load instances." });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
