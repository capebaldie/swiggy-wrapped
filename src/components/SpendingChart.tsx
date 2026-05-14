"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlySpendBucket } from "@/types/analytics";
import { formatINRCompact } from "@/lib/utils";

interface Props {
  data: MonthlySpendBucket[];
  variant?: "bar" | "line";
  height?: number;
}

export function SpendingChart({ data, variant = "bar", height = 200 }: Props) {
  const chartData = data.map((d) => ({
    label: d.monthLabel,
    spend: Math.round(d.totalPaise / 100),
    orders: d.orderCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      {variant === "bar" ? (
        <BarChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="label"
            tick={{ fill: "rgb(var(--text-muted))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(224,122,60,0.08)" }} />
          <Bar dataKey="spend" radius={[8, 8, 4, 4]} fill="rgb(var(--accent-orange))" />
        </BarChart>
      ) : (
        <LineChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fill: "rgb(var(--text-muted))", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="spend"
            stroke="rgb(var(--accent-orange))"
            strokeWidth={2.5}
            dot={false}
          />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}

interface TooltipPayload {
  active?: boolean;
  payload?: Array<{ payload: { label: string; spend: number; orders: number } }>;
}

function ChartTooltip({ active, payload }: TooltipPayload) {
  if (!active || !payload?.length) return null;
  const { label, spend, orders } = payload[0].payload;
  return (
    <div className="rounded-xl bg-surface px-3 py-2 shadow-elevated">
      <div className="text-[11px] font-medium uppercase tracking-wide text-text-muted">{label}</div>
      <div className="text-sm font-semibold text-text-primary">{formatINRCompact(spend * 100)}</div>
      <div className="text-[11px] text-text-muted">{orders} {orders === 1 ? "order" : "orders"}</div>
    </div>
  );
}
