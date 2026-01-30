import { WorkflowItem } from "@/hooks/useWorkflows";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";

type WorkflowTableProps = {
  workflows: WorkflowItem[];
  onToggle: (workflowId: string, active: boolean) => void;
  selectedIds: Set<string>;
  onSelect: (workflowId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit?: (workflowId: string) => void;
  onView?: (workflowId: string) => void;
};

export default function WorkflowTable({
  workflows,
  onToggle,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onView,
}: WorkflowTableProps) {
  const allSelected = workflows.length > 0 && workflows.every((workflow) => selectedIds.has(workflow.id));
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(event) => onSelectAll(event.target.checked)}
            />
          </TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Updated</TableHeaderCell>
          <TableHeaderCell />
        </TableRow>
      </TableHead>
      <tbody>
        {workflows.map((workflow) => (
          <TableRow key={workflow.id}>
            <TableCell>
              <input
                type="checkbox"
                checked={selectedIds.has(workflow.id)}
                onChange={(event) => onSelect(workflow.id, event.target.checked)}
              />
            </TableCell>
            <TableCell className="font-medium">{workflow.name ?? workflow.id}</TableCell>
            <TableCell>
              <Badge variant={workflow.active ? "success" : "default"}>
                {workflow.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted">
              {workflow.updatedAt ? new Date(workflow.updatedAt).toLocaleString() : "-"}
            </TableCell>
            <TableCell className="text-right">
              <button
                type="button"
                onClick={() => onToggle(workflow.id, Boolean(workflow.active))}
                aria-pressed={Boolean(workflow.active)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full border transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  workflow.active
                    ? "border-primary/40 bg-primary/20 shadow-[0_0_14px_rgba(99,102,241,0.35)]"
                    : "border-border bg-background"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-card shadow transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    workflow.active ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
              {onView && (
                <Button variant="secondary" className="ml-2" onClick={() => onView(workflow.id)}>
                  View
                </Button>
              )}
              {onEdit && (
                <Button variant="secondary" className="ml-2" onClick={() => onEdit(workflow.id)}>
                  Edit
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
