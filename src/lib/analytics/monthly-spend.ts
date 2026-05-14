import type { Order } from "@/types/order";
import type { MonthlySpendBucket } from "@/types/analytics";
import { MONTH_NAMES } from "@/lib/utils";

export function calculateMonthlySpend(orders: Order[]): MonthlySpendBucket[] {
  if (orders.length === 0) return [];
  const buckets = new Map<string, MonthlySpendBucket>();

  for (const o of orders) {
    const d = new Date(o.placedAt);
    const year = d.getUTCFullYear();
    const month = d.getUTCMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
    const existing = buckets.get(monthKey);
    if (existing) {
      existing.totalPaise += o.total;
      existing.orderCount += 1;
    } else {
      buckets.set(monthKey, {
        monthKey,
        monthLabel: MONTH_NAMES[month],
        year,
        totalPaise: o.total,
        orderCount: 1,
      });
    }
  }

  return Array.from(buckets.values()).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
}

export function biggestMonth(orders: Order[]): MonthlySpendBucket | null {
  const months = calculateMonthlySpend(orders);
  if (months.length === 0) return null;
  return [...months].sort((a, b) => b.totalPaise - a.totalPaise)[0];
}
