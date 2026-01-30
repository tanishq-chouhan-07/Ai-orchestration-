import { Card } from "@/components/ui/Card";

type CostBreakdownProps = {
  total: number;
  unitCost: number;
  className?: string;
};

export default function CostBreakdown({ total, unitCost, className }: CostBreakdownProps) {
  return (
    <Card className={`space-y-2 ${className ?? ""}`}>
      <h3 className="text-sm font-semibold">Estimated cost</h3>
      <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
      <p className="text-xs text-muted">Unit cost: ${unitCost.toFixed(4)}</p>
    </Card>
  );
}
