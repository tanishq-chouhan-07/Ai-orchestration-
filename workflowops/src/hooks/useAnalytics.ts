"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type AnalyticsState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type UseAnalyticsOptions = {
  instanceId?: string;
  workflowId?: string;
  unitCost?: number;
};

export function useAnalytics({ instanceId, workflowId, unitCost = 0.002 }: UseAnalyticsOptions) {
  const [stats, setStats] = useState<AnalyticsState<unknown>>({ data: null, loading: false, error: null });
  const [costs, setCosts] = useState<AnalyticsState<unknown>>({ data: null, loading: false, error: null });
  const [trends, setTrends] = useState<AnalyticsState<unknown>>({ data: null, loading: false, error: null });
  const [anomalies, setAnomalies] = useState<AnalyticsState<unknown>>({ data: null, loading: false, error: null });

  const canLoad = useMemo(() => Boolean(instanceId), [instanceId]);

  const loadStats = useCallback(async () => {
    if (!instanceId) return;
    setStats((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ instanceId });
      if (workflowId) params.set("workflowId", workflowId);
      const response = await fetch(`/api/analytics/stats?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("stats");
      const payload = await response.json();
      setStats({ data: payload.data ?? null, loading: false, error: null });
    } catch {
      setStats({ data: null, loading: false, error: "Failed to load stats." });
    }
  }, [instanceId, workflowId]);

  const loadCosts = useCallback(async () => {
    if (!instanceId) return;
    setCosts((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ instanceId, unitCost: String(unitCost) });
      if (workflowId) params.set("workflowId", workflowId);
      const response = await fetch(`/api/analytics/costs?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("costs");
      const payload = await response.json();
      setCosts({ data: payload.data ?? null, loading: false, error: null });
    } catch {
      setCosts({ data: null, loading: false, error: "Failed to load costs." });
    }
  }, [instanceId, workflowId, unitCost]);

  const loadTrends = useCallback(async () => {
    if (!instanceId) return;
    setTrends((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ instanceId });
      if (workflowId) params.set("workflowId", workflowId);
      const response = await fetch(`/api/analytics/trends?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("trends");
      const payload = await response.json();
      setTrends({ data: payload.data ?? null, loading: false, error: null });
    } catch {
      setTrends({ data: null, loading: false, error: "Failed to load trends." });
    }
  }, [instanceId, workflowId]);

  const loadAnomalies = useCallback(async () => {
    if (!instanceId) return;
    setAnomalies((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const params = new URLSearchParams({ instanceId });
      if (workflowId) params.set("workflowId", workflowId);
      const response = await fetch(`/api/analytics/anomalies?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("anomalies");
      const payload = await response.json();
      setAnomalies({ data: payload.data ?? null, loading: false, error: null });
    } catch {
      setAnomalies({ data: null, loading: false, error: "Failed to load anomalies." });
    }
  }, [instanceId, workflowId]);

  const loadAll = useCallback(async () => {
    if (!instanceId) return;
    await Promise.all([loadStats(), loadCosts(), loadTrends(), loadAnomalies()]);
  }, [instanceId, loadStats, loadCosts, loadTrends, loadAnomalies]);

  useEffect(() => {
    if (!canLoad) return;
    void loadAll();
  }, [canLoad, loadAll]);

  return { stats, costs, trends, anomalies, reload: loadAll };
}
