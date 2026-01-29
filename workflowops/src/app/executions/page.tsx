"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState } from "@/components/ui/States";
import ExecutionHistory from "@/components/features/ExecutionHistory";
import { useInstances } from "@/hooks/useInstances";
import { useExecutions } from "@/hooks/useExecutions";

export default function ExecutionsPage() {
  const { data: instances, loading: instancesLoading } = useInstances();
  const [instanceId, setInstanceId] = useState("");
  const [workflowId, setWorkflowId] = useState("");
  const [status, setStatus] = useState("");
  const { data, loading, error, reload } = useExecutions({ instanceId, workflowId, status });
  const [busy, setBusy] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPayload, setDetailPayload] = useState<string>("");

  const hasInstance = useMemo(() => Boolean(instanceId), [instanceId]);

  async function retryExecution(executionId?: string) {
    if (!executionId || !instanceId) return;
    setBusy(true);
    try {
      await fetch(`/api/proxy/executions/${executionId}/retry?instanceId=${instanceId}`, {
        method: "POST",
      });
      await reload();
    } finally {
      setBusy(false);
    }
  }

  async function viewExecution(executionId?: string) {
    if (!executionId || !instanceId) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/proxy/executions/${executionId}?instanceId=${instanceId}`);
      if (response.ok) {
        const payload = await response.json();
        setDetailPayload(JSON.stringify(payload, null, 2));
        setDetailOpen(true);
      }
    } finally {
      setBusy(false);
    }
  }

  async function deleteExecution(executionId?: string) {
    if (!executionId || !instanceId) return;
    setBusy(true);
    try {
      await fetch(`/api/proxy/executions/${executionId}?instanceId=${instanceId}`, {
        method: "DELETE",
      });
      await reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
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
            <input
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              placeholder="Workflow ID (optional)"
              value={workflowId}
              onChange={(event) => setWorkflowId(event.target.value)}
            />
            <select
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="running">Running</option>
            </select>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={() => reload()} disabled={!hasInstance || loading}>
              Refresh
            </Button>
          </div>
        </Card>

        {error && <ErrorState message={error} />}

        {!hasInstance ? (
          <EmptyState title="Select an instance" description="Choose an instance to view executions." />
        ) : loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} className="h-12" />
            ))}
          </div>
        ) : data.length === 0 ? (
          <EmptyState title="No executions found" description="Try a different filter." />
        ) : (
          <ExecutionHistory
            executions={data}
            busy={busy}
            onRetry={retryExecution}
            onView={viewExecution}
            onDelete={deleteExecution}
          />
        )}
      </div>
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Execution details">
        <pre className="max-h-96 overflow-auto rounded-[var(--radius)] border border-border bg-background p-3 text-xs">
          {detailPayload}
        </pre>
      </Modal>
    </DashboardLayout>
  );
}
