"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";

export default function AdminGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Card>
        <p className="text-sm text-muted">Checking access...</p>
      </Card>
    );
  }

  if (!user || user.role !== "admin") return null;

  return children;
}
