"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ExecutionItem = {
  id?: string;
  status?: string;
  startedAt?: string;
  stoppedAt?: string;
  workflowId?: string;
  finished?: boolean;
};

type ExecutionsState = {
  data: ExecutionItem[];
  loading: boolean;
  error: string | null;
};

type UseExecutionsOptions = {
  instanceId?: string;
  workflowId?: string;
  status?: string;
};

export function useExecutions({ instanceId, workflowId, status }: UseExecutionsOptions) {
  const [state, setState] = useState<ExecutionsState>({
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
      const params = new URLSearchParams({
        instanceId,
      });
      if (workflowId) params.set("workflowId", workflowId);
      if (status) params.set("status", status);

      const response = await fetch(`/api/proxy/executions?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        setState({ data: [], loading: false, error: "Failed to load executions." });
        return;
      }
      const payload = (await response.json()) as { data: ExecutionItem[] };
      setState({ data: payload.data ?? [], loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: "Failed to load executions." });
    }
  }, [instanceId, workflowId, status]);

  useEffect(() => {
    if (!canLoad) return;
    void load();
  }, [canLoad, load]);

  return { ...state, reload: load };
}
