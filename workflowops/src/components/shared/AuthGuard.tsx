"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthGuard({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-6 w-40" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      </Card>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
