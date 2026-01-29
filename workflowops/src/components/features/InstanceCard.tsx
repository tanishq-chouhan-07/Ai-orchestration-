import { Instance } from "@/hooks/useInstances";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function statusToVariant(status?: string) {
  if (!status) return "default";
  if (status === "healthy") return "success";
  if (status === "warning") return "warning";
  return "danger";
}

type InstanceCardProps = {
  instance: Instance;
  onDelete: (id: string) => void;
  onEdit?: (instance: Instance) => void;
};

export default function InstanceCard({ instance, onDelete, onEdit }: InstanceCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold">{instance.name}</h3>
          <p className="text-xs text-muted">{instance.url}</p>
        </div>
        <Badge variant={statusToVariant(instance.healthStatus)}>
          {instance.healthStatus ?? "unknown"}
        </Badge>
      </div>
      <div className="text-xs text-muted">
        Last check: {instance.lastHealthCheck ? new Date(instance.lastHealthCheck).toLocaleString() : "Never"}
      </div>
      <div>
        {onEdit && (
          <Button variant="secondary" onClick={() => onEdit(instance)}>
            Edit
          </Button>
        )}
        <Button variant="danger" className={onEdit ? "ml-2" : undefined} onClick={() => onDelete(instance.id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}
