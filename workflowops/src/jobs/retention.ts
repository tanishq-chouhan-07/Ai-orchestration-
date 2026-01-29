import { connectToDatabase } from "@/lib/db";
import ExecutionCache from "@/models/ExecutionCache";
import RetentionPolicy from "@/models/RetentionPolicy";

export async function runRetentionJob() {
  await connectToDatabase();

  const policies = await RetentionPolicy.find({});

  if (!policies.length) {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const result = await ExecutionCache.deleteMany({ cachedAt: { $lt: cutoff } });
    return result.deletedCount ?? 0;
  }

  let deleted = 0;
  for (const policy of policies) {
    const cutoff = new Date(Date.now() - policy.retentionDays * 24 * 60 * 60 * 1000);
    const filter: Record<string, unknown> = {
      instanceId: policy.instanceId,
      cachedAt: { $lt: cutoff },
    };
    if (policy.workflowId) filter.workflowId = policy.workflowId;
    const result = await ExecutionCache.deleteMany(filter);
    deleted += result.deletedCount ?? 0;
  }

  return deleted;
}
