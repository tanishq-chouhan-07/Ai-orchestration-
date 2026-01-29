import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

type ErrorStateProps = {
  message: string;
  action?: ReactNode;
};

type LoadingStateProps = {
  title?: string;
  lines?: number;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export function ErrorState({ message, action }: ErrorStateProps) {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-danger">Something went wrong</h3>
      <p className="mt-2 text-sm text-danger">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}

export function LoadingState({ title = "Loading", lines = 2 }: LoadingStateProps) {
  return (
    <Card>
      <Skeleton className="h-5 w-32" />
      <div className="mt-3 space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton key={index} className="h-4" />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">{title}</p>
    </Card>
  );
}
