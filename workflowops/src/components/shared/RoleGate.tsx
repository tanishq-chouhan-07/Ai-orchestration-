"use client";

import { PropsWithChildren } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";

type RoleGateProps = PropsWithChildren<{ role: "admin" | "operator" | "viewer" }>;

const roleRank: Record<RoleGateProps["role"], number> = {
  viewer: 0,
  operator: 1,
  admin: 2,
};

export default function RoleGate({ role, children }: RoleGateProps) {
  const { user } = useAuth();
  const currentRole = (user?.role ?? "viewer") as RoleGateProps["role"];

  if (roleRank[currentRole] < roleRank[role]) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Access restricted</h2>
        <p className="mt-2 text-sm text-muted">Admin access is required for this section.</p>
      </Card>
    );
  }

  return children;
}
