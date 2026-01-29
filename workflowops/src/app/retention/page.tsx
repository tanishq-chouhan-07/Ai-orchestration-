"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  instanceSchema,
  instancesResponseSchema,
  retentionPoliciesResponseSchema,
  retentionPolicySchema,
} from "@/lib/api-contracts";

type Instance = z.infer<typeof instanceSchema>;

type RetentionPolicy = z.infer<typeof retentionPolicySchema>;

const defaultForm = {
  instanceId: "",
  workflowId: "",
  retentionDays: 30,
};

export default function RetentionPoliciesPage() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editDays, setEditDays] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const canCreate = form.instanceId && form.retentionDays > 0;

  const policyByInstance = useMemo(() => {
    const lookup: Record<string, RetentionPolicy[]> = {};
    policies.forEach((policy) => {
      const list = lookup[policy.instanceId] ?? [];
      list.push(policy);
      lookup[policy.instanceId] = list;
    });
    return lookup;
  }, [policies]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [instanceRes, policyRes] = await Promise.all([
          fetch("/api/instances", { cache: "no-store" }),
          fetch("/api/retention-policies", { cache: "no-store" }),
        ]);

        if (instanceRes.status === 401) {
          setError("Sign in required to view retention policies.");
          return;
        }
        if (policyRes.status === 403) {
          setError("Admin access required to manage retention policies.");
          return;
        }

        const instancesJson = instancesResponseSchema.parse(await instanceRes.json());
        const policiesJson = retentionPoliciesResponseSchema.parse(await policyRes.json());

        setInstances(instancesJson.data);
        setPolicies(policiesJson.data);
        setEditDays(
          policiesJson.data.reduce<Record<string, number>>((acc, policy) => {
            acc[policy.id] = policy.retentionDays;
            return acc;
          }, {})
        );
      } catch (err) {
        setError("Failed to load retention policies.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleCreate() {
    if (!canCreate) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/retention-policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceId: form.instanceId,
          workflowId: form.workflowId || undefined,
          retentionDays: form.retentionDays,
        }),
      });

      if (!response.ok) {
        const message = response.status === 403
          ? "Admin access required to create policies."
          : "Failed to create retention policy.";
        setError(message);
        return;
      }

      const policy = retentionPolicySchema.parse(await response.json());
      setPolicies((prev) => [policy, ...prev]);
      setEditDays((prev) => ({ ...prev, [policy.id]: policy.retentionDays }));
      setForm(defaultForm);
    } catch (err) {
      setError("Failed to create retention policy.");
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(policyId: string) {
    const retentionDays = editDays[policyId];
    if (!retentionDays) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/retention-policies/${policyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retentionDays }),
      });

      if (!response.ok) {
        const message = response.status === 403
          ? "Admin access required to update policies."
          : "Failed to update retention policy.";
        setError(message);
        return;
      }

      const policy = retentionPolicySchema.parse(await response.json());
      setPolicies((prev) => prev.map((item) => (item.id === policy.id ? policy : item)));
      setEditDays((prev) => ({ ...prev, [policy.id]: policy.retentionDays }));
    } catch (err) {
      setError("Failed to update retention policy.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(policyId: string) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/retention-policies/${policyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = response.status === 403
          ? "Admin access required to delete policies."
          : "Failed to delete retention policy.";
        setError(message);
        return;
      }

      setPolicies((prev) => prev.filter((item) => item.id !== policyId));
    } catch (err) {
      setError("Failed to delete retention policy.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-10">
        <header className="flex flex-col gap-3">
          <Link href="/" className="text-sm text-zinc-400 hover:text-zinc-200">
            ← Back to home
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Retention policies</h1>
              <p className="text-sm text-zinc-400">
                Define how long execution data is stored for each n8n instance or workflow.
              </p>
            </div>
            <div className="rounded-full border border-zinc-800 px-3 py-1 text-xs uppercase text-zinc-400">
              Admin only
            </div>
          </div>
        </header>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <h2 className="text-lg font-semibold">Create policy</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-[2fr_2fr_1fr_auto]">
            <label className="flex flex-col gap-2 text-sm">
              Instance
              <select
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                value={form.instanceId}
                onChange={(event) => setForm((prev) => ({ ...prev, instanceId: event.target.value }))}
              >
                <option value="">Select instance</option>
                {instances.map((instance) => (
                  <option key={instance.id} value={instance.id}>
                    {instance.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Workflow ID (optional)
              <input
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                placeholder="Workflow ID"
                value={form.workflowId}
                onChange={(event) => setForm((prev) => ({ ...prev, workflowId: event.target.value }))}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Retention (days)
              <input
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
                type="number"
                min={1}
                max={365}
                value={form.retentionDays}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, retentionDays: Number(event.target.value) }))
                }
              />
            </label>
            <button
              className="mt-auto rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-800"
              onClick={handleCreate}
              disabled={!canCreate || busy}
            >
              Create
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Policies</h2>
            <button
              className="text-sm text-zinc-400 hover:text-zinc-200"
              onClick={() => location.reload()}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-sm text-zinc-400">
              Loading retention policies...
            </div>
          ) : (
            <div className="space-y-6">
              {instances.map((instance) => {
                const instancePolicies = policyByInstance[instance.id] ?? [];
                return (
                  <div key={instance.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-base font-semibold">{instance.name}</h3>
                        <p className="text-xs text-zinc-500">{instance.url}</p>
                      </div>
                      <span className="text-xs text-zinc-500">
                        Policies: {instancePolicies.length}
                      </span>
                    </div>

                    {instancePolicies.length === 0 ? (
                      <p className="mt-4 text-sm text-zinc-500">No policies configured.</p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {instancePolicies.map((policy) => (
                          <div
                            key={policy.id}
                            className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 md:flex-row md:items-center md:justify-between"
                          >
                            <div>
                              <p className="text-sm font-medium">
                                Workflow: {policy.workflowId ?? "All workflows"}
                              </p>
                              <p className="text-xs text-zinc-500">Policy ID: {policy.id}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                className="w-24 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-sm"
                                type="number"
                                min={1}
                                max={365}
                                value={editDays[policy.id] ?? policy.retentionDays}
                                onChange={(event) =>
                                  setEditDays((prev) => ({
                                    ...prev,
                                    [policy.id]: Number(event.target.value),
                                  }))
                                }
                              />
                              <span className="text-xs text-zinc-500">days</span>
                              <button
                                className="rounded-lg border border-emerald-500/50 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/10"
                                onClick={() => handleUpdate(policy.id)}
                                disabled={busy}
                              >
                                Update
                              </button>
                              <button
                                className="rounded-lg border border-red-500/50 px-3 py-1 text-xs text-red-300 hover:bg-red-500/10"
                                onClick={() => handleDelete(policy.id)}
                                disabled={busy}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
