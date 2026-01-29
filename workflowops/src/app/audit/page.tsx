"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import AuditLogTable from "@/components/features/AuditLogTable";
import RoleGate from "@/components/shared/RoleGate";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { useEffect, useState } from "react";
import { EmptyState, ErrorState } from "@/components/ui/States";

export default function AuditPage() {
  const [action, setAction] = useState("");
  const [resource, setResource] = useState("");
  const [limit, setLimit] = useState(50);
  const [before, setBefore] = useState<string | null>(null);
  const [append, setAppend] = useState(false);
  const { data, loading, error, reload, nextCursor } = useAuditLogs({
    action,
    resource,
    limit,
    before,
    append,
  });

  useEffect(() => {
    setBefore(null);
    setAppend(false);
  }, [action, resource, limit]);

  useEffect(() => {
    if (!loading && append) {
      setAppend(false);
    }
  }, [loading, append]);

  return (
    <DashboardLayout>
      <RoleGate role="admin">
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Audit log</h2>
            <p className="text-sm text-muted">Admin-only events.</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setBefore(null);
              setAppend(false);
              reload();
            }}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>

        <Card>
          <h3 className="text-sm font-semibold">Filters</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <input
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              placeholder="Action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
            />
            <input
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              placeholder="Resource"
              value={resource}
              onChange={(event) => setResource(event.target.value)}
            />
            <input
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              type="number"
              min={10}
              max={200}
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
            />
          </div>
        </Card>

        {error && <ErrorState message={error} />}

        {loading ? (
          <Skeleton className="h-32" />
        ) : data.length === 0 ? (
          <EmptyState title="No audit entries yet" description="Audit logs will appear here." />
        ) : (
          <div className="space-y-3">
            <AuditLogTable logs={data} />
            {nextCursor && (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setBefore(nextCursor);
                    setAppend(true);
                  }}
                  disabled={loading}
                >
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
        </div>
      </RoleGate>
    </DashboardLayout>
  );
}
