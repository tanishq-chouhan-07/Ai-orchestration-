"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type WorkflowItem = {
  id: string;
  name?: string;
  active?: boolean;
  updatedAt?: string;
};

type WorkflowsState = {
  data: WorkflowItem[];
  loading: boolean;
  error: string | null;
};

type UseWorkflowsOptions = {
  instanceId?: string;
};

export function useWorkflows({ instanceId }: UseWorkflowsOptions) {
  const [state, setState] = useState<WorkflowsState>({
    data: [],
    loading: false,
    error: null,
  });

  const canLoad = useMemo(() => Boolean(instanceId), [instanceId]);

  const load = useCallback(async () => {
    if (!instanceId) {
      setState({ data: [], loading: false, error: null });
      return;
    }
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/proxy/workflows?instanceId=${instanceId}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        setState({ data: [], loading: false, error: "Failed to load workflows." });
        return;
      }
      const payload = (await response.json()) as { data: WorkflowItem[] };
      setState({ data: payload.data ?? [], loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: "Failed to load workflows." });
    }
  }, [instanceId]);

  useEffect(() => {
    if (!canLoad) return;
    void load();
  }, [canLoad, load]);

  return { ...state, reload: load };
}
