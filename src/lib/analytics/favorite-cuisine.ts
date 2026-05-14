import type { Order } from "@/types/order";
import type { CuisineStat } from "@/types/analytics";

export function calculateFavoriteCuisine(orders: Order[]): CuisineStat[] {
  if (orders.length === 0) return [];
  const map = new Map<string, { orderCount: number; spendPaise: number }>();
  for (const o of orders) {
    const key = o.restaurant.cuisine;
    const cur = map.get(key) ?? { orderCount: 0, spendPaise: 0 };
    cur.orderCount += 1;
    cur.spendPaise += o.total;
    map.set(key, cur);
  }
  const total = orders.length;
  return Array.from(map.entries())
    .map(([cuisine, stat]) => ({
      cuisine: cuisine as CuisineStat["cuisine"],
      orderCount: stat.orderCount,
      spendPaise: stat.spendPaise,
      percentage: Math.round((stat.orderCount / total) * 100),
    }))
    .sort((a, b) => b.orderCount - a.orderCount);
}
