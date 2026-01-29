import ExecutionCache from "@/models/ExecutionCache";

export async function getCachedExecutions(
  instanceId: string,
  workflowId: string,
  maxAgeMs: number
) {
  const cached = await ExecutionCache.findOne({ instanceId, workflowId }).sort({ cachedAt: -1 });
  if (!cached) return null;
  const isFresh = Date.now() - cached.cachedAt.getTime() <= maxAgeMs;
  return isFresh ? cached.executions : null;
}

export async function setCachedExecutions(
  instanceId: string,
  workflowId: string,
  executions: unknown[]
) {
  await ExecutionCache.findOneAndUpdate(
    { instanceId, workflowId },
    { executions, cachedAt: new Date() },
    { upsert: true, new: true }
  );
}
