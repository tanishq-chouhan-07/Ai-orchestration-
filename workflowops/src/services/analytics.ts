type ExecutionLike = {
  status?: string;
  startedAt?: string;
  stoppedAt?: string;
};

export function getStats(executions: ExecutionLike[]) {
  const total = executions.length;
  const success = executions.filter((e) => e.status === "success").length;
  const error = executions.filter((e) => e.status === "error").length;
  const waiting = executions.filter((e) => e.status === "waiting").length;

  const durations = executions
    .map((e) => {
      if (!e.startedAt || !e.stoppedAt) return null;
      const start = new Date(e.startedAt).getTime();
      const stop = new Date(e.stoppedAt).getTime();
      return Number.isFinite(start) && Number.isFinite(stop) ? Math.max(stop - start, 0) : null;
    })
    .filter((v): v is number => v !== null);

  const avgDurationMs = durations.length
    ? Math.round(durations.reduce((sum, v) => sum + v, 0) / durations.length)
    : 0;

  const successRate = total ? Math.round((success / total) * 10000) / 100 : 0;

  return { total, success, error, waiting, successRate, avgDurationMs };
}

export function getCostEstimate(executions: ExecutionLike[], unitCost: number) {
  const total = executions.length;
  const cost = Math.round(total * unitCost * 10000) / 10000;
  return { totalExecutions: total, unitCost, cost };
}

type TrendPoint = {
  date: string;
  total: number;
  success: number;
  error: number;
  successRate: number;
  avgDurationMs: number;
};

function toDateKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function getTrends(executions: ExecutionLike[], days: number): TrendPoint[] {
  const buckets = new Map<string, ExecutionLike[]>();
  for (const execution of executions) {
    if (!execution.startedAt) continue;
    const key = toDateKey(execution.startedAt);
    if (!key) continue;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(execution);
  }

  const result: TrendPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    const key = day.toISOString().slice(0, 10);
    const stats = getStats(buckets.get(key) ?? []);
    result.push({
      date: key,
      total: stats.total,
      success: stats.success,
      error: stats.error,
      successRate: stats.successRate,
      avgDurationMs: stats.avgDurationMs,
    });
  }

  return result;
}

export function detectAnomalies(trends: TrendPoint[]) {
  if (trends.length < 3) return [];

  const latest = trends[trends.length - 1];
  const baseline = trends.slice(0, -1);
  const avgErrorRate = baseline.length
    ? baseline.reduce((sum, t) => sum + (t.total ? (t.error / t.total) * 100 : 0), 0) /
      baseline.length
    : 0;

  const latestErrorRate = latest.total ? (latest.error / latest.total) * 100 : 0;
  const severity = latestErrorRate - avgErrorRate;
  if (severity < 10) return [];

  return [
    {
      date: latest.date,
      metric: "error_rate",
      expected: Math.round(avgErrorRate * 100) / 100,
      actual: Math.round(latestErrorRate * 100) / 100,
      severity: severity > 25 ? "high" : severity > 15 ? "medium" : "low",
    },
  ];
}
