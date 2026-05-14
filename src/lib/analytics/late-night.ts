import type { Order } from "@/types/order";
import type { LateNightStat } from "@/types/analytics";

function isLateNight(hour: number) {
  return hour >= 22 || hour < 3;
}

export function calculateLateNightOrders(orders: Order[]): LateNightStat {
  if (orders.length === 0) return { count: 0, total: 0, percentage: 0, topItem: null };
  const itemCounts = new Map<string, number>();
  let count = 0;
  for (const o of orders) {
    const hour = new Date(o.placedAt).getUTCHours();
    if (isLateNight(hour)) {
      count += 1;
      for (const it of o.items) {
        itemCounts.set(it.name, (itemCounts.get(it.name) ?? 0) + it.quantity);
      }
    }
  }
  let topItem: string | null = null;
  let topCount = 0;
  for (const [name, c] of itemCounts) {
    if (c > topCount) {
      topCount = c;
      topItem = name;
    }
  }
  return {
    count,
    total: orders.length,
    percentage: Math.round((count / orders.length) * 100),
    topItem,
  };
}
