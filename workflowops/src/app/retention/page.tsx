"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoleGate from "@/components/shared/RoleGate";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { retentionPolicySchema } from "@/lib/api-contracts";
import { useRetentionPolicies } from "@/hooks/useRetentionPolicies";

type RetentionPolicy = z.infer<typeof retentionPolicySchema>;

const defaultForm = {
  instanceId: "",
  workflowId: "",
  retentionDays: 30,
};

export default function RetentionPoliciesPage() {
  const { instances, policies, loading, error: loadError, reload } = useRetentionPolicies();
  const [form, setForm] = useState(defaultForm);
  const [editDays, setEditDays] = useState<Record<string, number>>({});
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
    setEditDays(
      policies.reduce<Record<string, number>>((acc, policy) => {
        acc[policy.id] = policy.retentionDays;
        return acc;
      }, {})
    );
  }, [policies]);

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

      retentionPolicySchema.parse(await response.json());
      setForm(defaultForm);
      await reload();
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

      retentionPolicySchema.parse(await response.json());
      await reload();
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
      await reload();
    } catch (err) {
      setError("Failed to delete retention policy.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardLayout>
      <RoleGate role="admin">
        <div className="space-y-6">
          <Card>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Retention policies</h1>
                <p className="text-sm text-muted">
                  Define how long execution data is stored for each n8n instance or workflow.
                </p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs uppercase text-muted">
                Admin only
              </span>
            </div>
          </Card>

          {(error ?? loadError) && (
            <Card>
              <p className="text-sm text-danger">{error ?? loadError}</p>
            </Card>
          )}

          <Card>
            <h2 className="text-lg font-semibold">Create policy</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-[2fr_2fr_1fr_auto]">
              <label className="flex flex-col gap-2 text-sm">
                Instance
                <select
                  className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
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
                <Input
                  placeholder="Workflow ID"
                  value={form.workflowId}
                  onChange={(event) => setForm((prev) => ({ ...prev, workflowId: event.target.value }))}
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                Retention (days)
                <Input
                  type="number"
                  min={1}
                  max={365}
                  value={form.retentionDays}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, retentionDays: Number(event.target.value) }))
                  }
                />
              </label>
              <Button onClick={handleCreate} disabled={!canCreate || busy}>
                Create
              </Button>
            </div>
          </Card>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Policies</h2>
              <Button variant="secondary" onClick={() => reload()} disabled={loading}>
                Refresh
              </Button>
            </div>

            {loading ? (
              <Skeleton className="h-32" />
            ) : (
              <div className="space-y-6">
                {instances.map((instance) => {
                  const instancePolicies = policyByInstance[instance.id] ?? [];
                  return (
                    <Card key={instance.id}>
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-base font-semibold">{instance.name}</h3>
                          <p className="text-xs text-muted">{instance.url}</p>
                        </div>
                        <span className="text-xs text-muted">
                          Policies: {instancePolicies.length}
                        </span>
                      </div>

                      {instancePolicies.length === 0 ? (
                        <p className="mt-4 text-sm text-muted">No policies configured.</p>
                      ) : (
                        <div className="mt-4 space-y-3">
                          {instancePolicies.map((policy) => (
                            <div
                              key={policy.id}
                              className="flex flex-col gap-3 rounded-[var(--radius)] border border-border bg-background p-4 md:flex-row md:items-center md:justify-between"
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  Workflow: {policy.workflowId ?? "All workflows"}
                                </p>
                                <p className="text-xs text-muted">Policy ID: {policy.id}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Input
                                  className="w-24"
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
                                <span className="text-xs text-muted">days</span>
                                <Button
                                  variant="secondary"
                                  onClick={() => handleUpdate(policy.id)}
                                  disabled={busy}
                                >
                                  Update
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => handleDelete(policy.id)}
                                  disabled={busy}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </RoleGate>
    </DashboardLayout>
  );
}
