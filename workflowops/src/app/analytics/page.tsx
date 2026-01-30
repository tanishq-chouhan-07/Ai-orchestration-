"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import StatsCard from "@/components/features/StatsCard";
import CostBreakdown from "@/components/features/CostBreakdown";
import TrafficChart from "@/components/features/TrafficChart";
import SuccessRateChart from "@/components/features/SuccessRateChart";
import { EmptyState, ErrorState } from "@/components/ui/States";
import { useInstances } from "@/hooks/useInstances";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsPage() {
  const { data: instances, loading: instancesLoading } = useInstances();
  const [instanceId, setInstanceId] = useState("");
  const [workflowId, setWorkflowId] = useState("");
  const [unitCost, setUnitCost] = useState(0.002);

  const { stats, costs, trends, anomalies, reload } = useAnalytics({
    instanceId,
    workflowId: workflowId || undefined,
    unitCost,
  });

  const hasInstance = useMemo(() => Boolean(instanceId), [instanceId]);

  const trendPoints = useMemo(() => {
    const data =
      (trends.data as Array<{ date: string; total: number; successRate: number }> | null) ?? [];
    return data;
  }, [trends.data]);

  const anomaliesList = useMemo(() => {
    return (
      (anomalies.data as Array<{
        date: string;
        expected: number;
        actual: number;
        severity: "low" | "medium" | "high";
      }> | null) ?? []
    );
  }, [anomalies.data]);

  const statsData = stats.data as {
    total?: number;
    success?: number;
    error?: number;
    successRate?: number;
  } | null;

  const costData = costs.data as { cost?: number } | null;
  const analyticsError = stats.error ?? costs.error ?? trends.error ?? anomalies.error;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="fade-up stagger-1">
          <h2 className="text-lg font-semibold">Analytics filters</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
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
            <input
              className="h-10 rounded-[var(--radius)] border border-border bg-background px-3 text-sm"
              type="number"
              step="0.001"
              value={unitCost}
              onChange={(event) => setUnitCost(Number(event.target.value))}
            />
            <Button variant="secondary" onClick={() => reload()} disabled={!hasInstance}>
              Refresh
            </Button>
          </div>
        </Card>

        {analyticsError && <ErrorState message={analyticsError} />}

        {!hasInstance ? (
          <EmptyState title="Select an instance" description="Choose an instance to view analytics." />
        ) : stats.loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <StatsCard className="fade-up stagger-2" label="Total" value={statsData?.total ?? 0} />
            <StatsCard className="fade-up stagger-3" label="Success" value={statsData?.success ?? 0} />
            <StatsCard className="fade-up stagger-4" label="Errors" value={statsData?.error ?? 0} />
            <StatsCard
              className="fade-up"
              label="Success rate"
              value={`${Math.round(statsData?.successRate ?? 0)}%`}
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {costs.loading ? (
            <Skeleton className="h-40" />
          ) : (
            <CostBreakdown
              className="fade-up stagger-2"
              total={(costData as { cost?: number } | null)?.cost ?? 0}
              unitCost={unitCost}
            />
          )}
          {trends.loading ? (
            <Skeleton className="h-40" />
          ) : (
            <TrafficChart className="fade-up stagger-3" points={trendPoints} />
          )}
        </div>

        {trends.loading ? (
          <Skeleton className="h-40" />
        ) : (
          <SuccessRateChart
            className="fade-up stagger-4"
            points={trendPoints.map((point) => ({ date: point.date, successRate: point.successRate }))}
          />
        )}

        <Card className="fade-up stagger-2">
          <h3 className="text-sm font-semibold">Anomalies</h3>
          <div className="mt-3 space-y-2 text-sm text-muted">
            {anomaliesList.length === 0 && <p>No anomalies detected.</p>}
            {anomaliesList.map((item) => (
              <div key={item.date} className="flex items-center justify-between">
                <div>
                  <div>{item.date}</div>
                  <div className="text-xs text-muted">Severity: {item.severity}</div>
                </div>
                <span className="text-foreground">
                  {item.actual}% vs {item.expected}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
