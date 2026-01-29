import { connectToDatabase } from "@/lib/db";
import { decryptString } from "@/lib/encryption";
import Instance from "@/models/Instance";
import { fetchExecutions } from "@/services/n8n";

export async function runHealthCheckJob() {
  await connectToDatabase();
  const instances = await Instance.find({});

  for (const instance of instances) {
    const lastHealthCheck = new Date();
    try {
      const apiKey = decryptString(instance.encryptedApiKey);
      await fetchExecutions(instance.url, apiKey, { limit: 1 });
      instance.healthStatus = "healthy";
    } catch (error) {
      instance.healthStatus = "unhealthy";
    } finally {
      instance.lastHealthCheck = lastHealthCheck;
      await instance.save();
    }
  }

  return instances.length;
}
