"use client";

import { useCallback, useEffect, useState } from "react";

type AuditLog = {
  id: string;
  action: string;
  resource: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

type AuditState = {
  data: AuditLog[];
  loading: boolean;
  error: string | null;
  nextCursor: string | null;
};

type AuditFilters = {
  action?: string;
  resource?: string;
  limit?: number;
  before?: string | null;
  append?: boolean;
};

export function useAuditLogs(filters: AuditFilters = {}) {
  const [state, setState] = useState<AuditState>({
    data: [],
    loading: true,
    error: null,
    nextCursor: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const params = new URLSearchParams();
      if (filters.action) params.set("action", filters.action);
      if (filters.resource) params.set("resource", filters.resource);
      if (filters.limit) params.set("limit", String(filters.limit));
      if (filters.before) params.set("before", filters.before);

      const response = await fetch(`/api/audit-logs?${params.toString()}`, { cache: "no-store" });
      if (!response.ok) {
        setState((prev) => ({ ...prev, loading: false, error: "Failed to load audit logs." }));
        return;
      }
      const payload = (await response.json()) as { data: AuditLog[]; nextCursor?: string | null };
      setState((prev) => ({
        data: filters.append ? [...prev.data, ...(payload.data ?? [])] : payload.data ?? [],
        loading: false,
        error: null,
        nextCursor: payload.nextCursor ?? null,
      }));
    } catch {
      setState((prev) => ({ ...prev, loading: false, error: "Failed to load audit logs." }));
    }
  }, [filters.action, filters.resource, filters.limit, filters.before, filters.append]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
