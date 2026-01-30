"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState } from "@/components/ui/States";
import WorkflowTable from "@/components/features/WorkflowTable";
import { useInstances } from "@/hooks/useInstances";
import { useWorkflows } from "@/hooks/useWorkflows";

export default function WorkflowsPage() {
  const { data: instances, loading: instancesLoading } = useInstances();
  const [instanceId, setInstanceId] = useState<string>("");
  const { data, loading, error, reload } = useWorkflows({ instanceId });
  const [busy, setBusy] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [payloadText, setPayloadText] = useState("{\n  \"name\": \"Updated workflow name\"\n}");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPayload, setDetailPayload] = useState<string>("");

  const hasInstance = useMemo(() => Boolean(instanceId), [instanceId]);
  const selectedCount = useMemo(() => selectedIds.size, [selectedIds]);

  async function toggleWorkflow(workflowId: string, active: boolean) {
    if (!instanceId) return;
    setBusy(true);
    try {
      const endpoint = active ? "deactivate" : "activate";
      await fetch(`/api/proxy/workflows/${workflowId}/${endpoint}?instanceId=${instanceId}`, {
        method: "POST",
      });
      await reload();
    } finally {
      setBusy(false);
    }
  }

  async function handleBulk(action: "activate" | "deactivate") {
    if (!instanceId) return;
    setBusy(true);
    try {
      const workflowIds = selectedIds.size ? Array.from(selectedIds) : data.map((workflow) => workflow.id);
      await fetch(`/api/proxy/workflows/bulk/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceId, workflowIds }),
      });
      await reload();
      setSelectedIds(new Set());
    } finally {
      setBusy(false);
    }
  }

  function toggleSelect(workflowId: string, selected: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) next.add(workflowId);
      else next.delete(workflowId);
      return next;
    });
  }

  function toggleSelectAll(selected: boolean) {
    if (!selected) {
      setSelectedIds(new Set());
      return;
    }
    setSelectedIds(new Set(data.map((workflow) => workflow.id)));
  }

  function openEdit(workflowId: string) {
    const workflow = data.find((item) => item.id === workflowId);
    setPayloadText(
      JSON.stringify(
        {
          name: workflow?.name ?? "",
        },
        null,
        2
      )
    );
    setUpdateError(null);
    setEditingWorkflowId(workflowId);
  }

  async function handleUpdateWorkflow() {
    if (!editingWorkflowId || !instanceId) return;
    setBusy(true);
    try {
      let payload: unknown;
      try {
        payload = JSON.parse(payloadText);
      } catch (error) {
        setUpdateError("Invalid JSON payload.");
        return;
      }
      await fetch(`/api/proxy/workflows/${editingWorkflowId}?instanceId=${instanceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      await reload();
      setEditingWorkflowId(null);
      setUpdateError(null);
    } finally {
      setBusy(false);
    }
  }

  async function viewWorkflow(workflowId: string) {
    if (!instanceId) return;
    setBusy(true);
    try {
      const response = await fetch(
        `/api/proxy/workflows/${workflowId}?instanceId=${instanceId}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        return;
      }
      const payload = await response.json();
      setDetailPayload(JSON.stringify(payload, null, 2));
      setDetailOpen(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="fade-up stagger-1">
          <h2 className="text-lg font-semibold">Select instance</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              value={instanceId}
              onChange={(event) => setInstanceId(event.target.value)}
              disabled={instancesLoading}
            >
              <option value="">Choose an instance</option>
              {instances.map((instance) => (
                <option key={instance.id} value={instance.id}>
                  {instance.name}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={() => reload()} disabled={!hasInstance || loading}>
              Refresh
            </Button>
            <Button onClick={() => handleBulk("activate")} disabled={!hasInstance || busy || !data.length}>
              Bulk activate {selectedCount ? `(${selectedCount})` : ""}
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleBulk("deactivate")}
              disabled={!hasInstance || busy || !data.length}
            >
              Bulk deactivate {selectedCount ? `(${selectedCount})` : ""}
            </Button>
          </div>
        </Card>

        {error && <ErrorState message={error} />}

        {!hasInstance ? (
          <EmptyState
            title="Select an instance"
            description="Choose an instance to view workflows."
            action={
              <Button
                variant="secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Choose instance
              </Button>
            }
          />
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-12" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState
            title="No workflows found"
            description="Try refreshing or select a different instance."
            action={
              <Button variant="secondary" onClick={() => reload()} disabled={busy}>
                Refresh
              </Button>
            }
          />
        ) : (
          <div className="fade-up stagger-2">
            <WorkflowTable
              workflows={data}
              onToggle={toggleWorkflow}
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={toggleSelectAll}
              onEdit={openEdit}
              onView={viewWorkflow}
            />
          </div>
        )}
      </div>
      <Modal
        open={Boolean(editingWorkflowId)}
        onClose={() => setEditingWorkflowId(null)}
        title="Update workflow"
      >
        <label className="text-xs text-muted">Payload (JSON)</label>
        <textarea
          className="mt-2 h-40 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-xs"
          value={payloadText}
          onChange={(event) => setPayloadText(event.target.value)}
        />
        {updateError && <p className="mt-2 text-xs text-danger">{updateError}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEditingWorkflowId(null)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateWorkflow} disabled={busy}>
            Save
          </Button>
        </div>
      </Modal>
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Workflow details">
        <pre className="max-h-96 overflow-auto rounded-[var(--radius)] border border-border bg-background p-3 text-xs">
          {detailPayload}
        </pre>
      </Modal>
    </DashboardLayout>
  );
}
