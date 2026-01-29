import { Table, TableCell, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";

type AuditLog = {
  id: string;
  action: string;
  resource: string;
  createdAt: string;
};

type AuditLogTableProps = {
  logs: AuditLog[];
};

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Action</TableHeaderCell>
          <TableHeaderCell>Resource</TableHeaderCell>
          <TableHeaderCell>Time</TableHeaderCell>
        </TableRow>
      </TableHead>
      <tbody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.action}</TableCell>
            <TableCell className="text-muted">{log.resource}</TableCell>
            <TableCell className="text-muted">
              {new Date(log.createdAt).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
