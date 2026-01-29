import { Card } from "@/components/ui/Card";

type StatsCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export default function StatsCard({ label, value, helper }: StatsCardProps) {
  return (
    <Card className="flex flex-col gap-2">
      <span className="text-xs uppercase text-muted">{label}</span>
      <span className="text-2xl font-semibold text-foreground">{value}</span>
      {helper && <span className="text-xs text-muted">{helper}</span>}
    </Card>
  );
}
