"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, ErrorState } from "@/components/ui/States";
import InstanceCard from "@/components/features/InstanceCard";
import { useInstances } from "@/hooks/useInstances";

export default function InstancesPage() {
  const { data, loading, error, reload } = useInstances();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editInstanceId, setEditInstanceId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editApiKey, setEditApiKey] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const canSubmit = useMemo(() => name && url && apiKey, [name, url, apiKey]);

  async function handleCreate() {
    if (!canSubmit) return;
    setBusy(true);
    setFormError(null);
    try {
      const response = await fetch("/api/instances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, apiKey }),
      });

      if (!response.ok) {
        setFormError("Failed to create instance.");
        return;
      }

      setName("");
      setUrl("");
      setApiKey("");
      await reload();
    } catch (err) {
      setFormError("Failed to create instance.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/instances/${id}`, { method: "DELETE" });
      if (!response.ok) {
        return;
      }
      await reload();
    } finally {
      setBusy(false);
    }
  }

  function openEdit(instance: (typeof data)[number]) {
    setEditInstanceId(instance.id);
    setEditName(instance.name ?? "");
    setEditUrl(instance.url ?? "");
    setEditApiKey("");
    setEditError(null);
  }

  async function handleUpdate() {
    if (!editInstanceId) return;
    setBusy(true);
    setEditError(null);
    try {
      const payload: Record<string, string> = {};
      if (editName.trim()) payload.name = editName.trim();
      if (editUrl.trim()) payload.url = editUrl.trim();
      if (editApiKey.trim()) payload.apiKey = editApiKey.trim();

      if (!Object.keys(payload).length) {
        setEditError("Provide at least one field to update.");
        return;
      }

      const response = await fetch(`/api/instances/${editInstanceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setEditError("Failed to update instance.");
        return;
      }

      setEditInstanceId(null);
      await reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Add instance</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-xs text-muted">Name</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted">URL</label>
              <Input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://your-n8n" />
            </div>
            <div>
              <label className="text-xs text-muted">API key</label>
              <Input value={apiKey} onChange={(event) => setApiKey(event.target.value)} type="password" />
            </div>
          </div>
          {formError && <p className="mt-3 text-sm text-danger">{formError}</p>}
          <Button className="mt-4" onClick={handleCreate} disabled={!canSubmit || busy}>
            {busy ? "Saving..." : "Save instance"}
          </Button>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Instances</h2>
          <Button variant="secondary" onClick={() => reload()} disabled={loading}>
            Refresh
          </Button>
        </div>

        {error && <ErrorState message={error} />}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-40" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.map((instance) => (
              <InstanceCard
                key={instance.id}
                instance={instance}
                onDelete={handleDelete}
                onEdit={openEdit}
              />
            ))}
            {data.length === 0 && (
              <EmptyState title="No instances yet" description="Add an instance to get started." />
            )}
          </div>
        )}
      </div>
      <Modal
        open={Boolean(editInstanceId)}
        onClose={() => setEditInstanceId(null)}
        title="Edit instance"
      >
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted">Name</label>
            <Input value={editName} onChange={(event) => setEditName(event.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted">URL</label>
            <Input value={editUrl} onChange={(event) => setEditUrl(event.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted">API key (leave blank to keep)</label>
            <Input
              value={editApiKey}
              onChange={(event) => setEditApiKey(event.target.value)}
              type="password"
            />
          </div>
          {editError && <p className="text-sm text-danger">{editError}</p>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEditInstanceId(null)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={busy}>
            Save
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
