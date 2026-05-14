import type { Order } from "@/types/order";
import type { AOVStat } from "@/types/analytics";

export function calculateAverageOrderValue(orders: Order[]): AOVStat {
  if (orders.length === 0) return { aovPaise: 0, orderCount: 0 };
  const total = orders.reduce((s, o) => s + o.total, 0);
  return { aovPaise: Math.round(total / orders.length), orderCount: orders.length };
}
