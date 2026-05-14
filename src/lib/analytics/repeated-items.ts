import type { Order } from "@/types/order";
import type { RepeatedItem } from "@/types/analytics";

export function calculateRepeatedItems(orders: Order[]): RepeatedItem[] {
  const map = new Map<string, { count: number; spendPaise: number; restaurants: Set<string> }>();
  for (const o of orders) {
    for (const item of o.items) {
      const cur = map.get(item.name) ?? { count: 0, spendPaise: 0, restaurants: new Set<string>() };
      cur.count += item.quantity;
      cur.spendPaise += item.unitPrice * item.quantity;
      cur.restaurants.add(o.restaurant.name);
      map.set(item.name, cur);
    }
  }
  return Array.from(map.entries())
    .filter(([, stat]) => stat.count >= 2)
    .map(([name, stat]) => ({
      name,
      count: stat.count,
      totalSpendPaise: stat.spendPaise,
      restaurants: Array.from(stat.restaurants),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
