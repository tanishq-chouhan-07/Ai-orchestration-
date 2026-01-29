"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <h2 className="text-lg font-semibold">Profile</h2>
          <div className="mt-3 text-sm text-muted">
            <div>Email: {user?.email ?? "-"}</div>
            <div>Name: {user?.name ?? "-"}</div>
            <div>Role: {user?.role ?? "viewer"}</div>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Theme</h2>
          <div className="mt-3">
            <ThemeToggle />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
