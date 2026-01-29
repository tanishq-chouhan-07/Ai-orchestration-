import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExecutionItem } from "@/hooks/useExecutions";

type ExecutionHistoryProps = {
  executions: ExecutionItem[];
  busy?: boolean;
  onRetry: (executionId?: string) => void;
  onView: (executionId?: string) => void;
  onDelete: (executionId?: string) => void;
};

export default function ExecutionHistory({
  executions,
  busy,
  onRetry,
  onView,
  onDelete,
}: ExecutionHistoryProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Execution</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell>Started</TableHeaderCell>
          <TableHeaderCell>Stopped</TableHeaderCell>
          <TableHeaderCell />
        </TableRow>
      </TableHead>
      <tbody>
        {executions.map((execution, index) => (
          <TableRow key={execution.id ?? index}>
            <TableCell className="font-medium">{execution.id ?? "-"}</TableCell>
            <TableCell>
              <Badge variant={execution.status === "error" ? "danger" : "success"}>
                {execution.status ?? "unknown"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted">
              {execution.startedAt ? new Date(execution.startedAt).toLocaleString() : "-"}
            </TableCell>
            <TableCell className="text-muted">
              {execution.stoppedAt ? new Date(execution.stoppedAt).toLocaleString() : "-"}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="secondary" onClick={() => onRetry(execution.id)} disabled={busy}>
                Retry
              </Button>
              <Button variant="secondary" className="ml-2" onClick={() => onView(execution.id)} disabled={busy}>
                View
              </Button>
              <Button variant="danger" className="ml-2" onClick={() => onDelete(execution.id)} disabled={busy}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
