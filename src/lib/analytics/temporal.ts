import type { Order } from "@/types/order";
import type { DayOfWeekStat, HourOfDayStat } from "@/types/analytics";
import { DAY_NAMES } from "@/lib/utils";

export function calculateDayOfWeek(orders: Order[]): DayOfWeekStat[] {
  const counts = new Array(7).fill(0);
  for (const o of orders) {
    const d = new Date(o.placedAt);
    counts[d.getUTCDay()] += 1;
  }
  return DAY_NAMES.map((day, i) => ({ day, orderCount: counts[i] }));
}

export function calculateHourOfDay(orders: Order[]): HourOfDayStat[] {
  const counts = new Array(24).fill(0);
  for (const o of orders) {
    const d = new Date(o.placedAt);
    counts[d.getUTCHours()] += 1;
  }
  return counts.map((orderCount, hour) => ({ hour, orderCount }));
}

export function topDayOfWeek(orders: Order[]): { day: string; orderCount: number } | null {
  const stats = calculateDayOfWeek(orders);
  if (stats.every((s) => s.orderCount === 0)) return null;
  return [...stats].sort((a, b) => b.orderCount - a.orderCount)[0];
}
