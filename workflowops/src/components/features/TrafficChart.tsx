"use client";

import { Card } from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type TrendPoint = { date: string; total: number };

type TrafficChartProps = {
  points: TrendPoint[];
};

export default function TrafficChart({ points }: TrafficChartProps) {
  return (
    <Card className="space-y-3">
      <h3 className="text-sm font-semibold">Traffic</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "var(--fg)" }}
            />
            <Line type="monotone" dataKey="total" stroke="var(--primary)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
