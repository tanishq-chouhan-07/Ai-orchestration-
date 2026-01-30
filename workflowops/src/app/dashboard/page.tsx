import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="fade-up stagger-1">
          <h2 className="text-lg font-semibold">Welcome to WorkflowOps</h2>
          <p className="mt-2 text-sm text-muted">
            Start by adding an n8n instance, then explore workflows and executions.
          </p>
        </Card>
        <Card className="fade-up stagger-2">
          <h3 className="text-base font-semibold">Quick actions</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>• Add an instance</li>
            <li>• Monitor executions</li>
            <li>• Review analytics</li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
}
