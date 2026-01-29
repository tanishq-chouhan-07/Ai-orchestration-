"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import {
  instanceSchema,
  instancesResponseSchema,
  retentionPoliciesResponseSchema,
  retentionPolicySchema,
} from "@/lib/api-contracts";

type Instance = z.infer<typeof instanceSchema>;

type RetentionPolicy = z.infer<typeof retentionPolicySchema>;

type RetentionState = {
  instances: Instance[];
  policies: RetentionPolicy[];
  loading: boolean;
  error: string | null;
};

export function useRetentionPolicies() {
  const [state, setState] = useState<RetentionState>({
    instances: [],
    policies: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const [instanceRes, policyRes] = await Promise.all([
        fetch("/api/instances", { cache: "no-store" }),
        fetch("/api/retention-policies", { cache: "no-store" }),
      ]);

      if (instanceRes.status === 401) {
        setState({ instances: [], policies: [], loading: false, error: "Sign in required." });
        return;
      }
      if (policyRes.status === 403) {
        setState({ instances: [], policies: [], loading: false, error: "Admin access required." });
        return;
      }

      const instancesJson = instancesResponseSchema.parse(await instanceRes.json());
      const policiesJson = retentionPoliciesResponseSchema.parse(await policyRes.json());

      setState({
        instances: instancesJson.data,
        policies: policiesJson.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({ instances: [], policies: [], loading: false, error: "Failed to load retention policies." });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
