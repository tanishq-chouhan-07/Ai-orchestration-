import { Card } from "@/components/ui/Card";

type CostBreakdownProps = {
  total: number;
  unitCost: number;
};

export default function CostBreakdown({ total, unitCost }: CostBreakdownProps) {
  return (
    <Card className="space-y-2">
      <h3 className="text-sm font-semibold">Estimated cost</h3>
      <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
      <p className="text-xs text-muted">Unit cost: ${unitCost.toFixed(4)}</p>
    </Card>
  );
}
