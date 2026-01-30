import { Card } from "@/components/ui/Card";

type StatsCardProps = {
  label: string;
  value: string | number;
  helper?: string;
  className?: string;
};

export default function StatsCard({ label, value, helper, className }: StatsCardProps) {
  return (
    <Card
      className={`flex flex-col gap-2 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-t dark:border-t-white/10 ${
        className ?? ""
      }`}
    >
      <span className="text-xs uppercase text-muted">{label}</span>
      <span className="text-2xl font-semibold text-foreground">{value}</span>
      {helper && <span className="text-xs text-muted">{helper}</span>}
    </Card>
  );
}
