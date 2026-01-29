import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import Instance from "@/models/Instance";
import { fetchExecutions, fetchWorkflows } from "@/services/n8n";
import { setCachedExecutions } from "@/services/cache";

const MAX_WORKFLOWS = 5;
const EXECUTION_LIMIT = 50;

export async function runCacheWarmupJob() {
  await connectToDatabase();
  const instances = await Instance.find({});
  let warmed = 0;

  for (const instance of instances) {
    try {
      const apiKey = decryptString(instance.encryptedApiKey);
      const workflows = (await fetchWorkflows(instance.url, apiKey)) as Array<{ id?: string }>;
      const targets = workflows.slice(0, MAX_WORKFLOWS);

      for (const workflow of targets) {
        if (!workflow.id) continue;
        const executions = await fetchExecutions(instance.url, apiKey, {
          workflowId: workflow.id,
          limit: EXECUTION_LIMIT,
        });
        await setCachedExecutions(instance._id.toString(), workflow.id, executions as unknown[]);
        warmed += 1;
      }
    } catch (error) {
      continue;
    }
  }

  return warmed;
}
