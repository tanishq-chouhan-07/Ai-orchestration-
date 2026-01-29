import cron from "node-cron";
import { runHealthCheckJob } from "@/jobs/health-check";
import { runRetentionJob } from "@/jobs/retention";

let started = false;

export function startScheduler() {
  if (started) return;
  started = true;

  cron.schedule("*/15 * * * *", async () => {
    await runHealthCheckJob();
  });

  cron.schedule("0 2 * * *", async () => {
    await runRetentionJob();
  });
}
