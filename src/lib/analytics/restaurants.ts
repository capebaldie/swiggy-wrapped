import type { Order } from "@/types/order";
import type { RestaurantStat } from "@/types/analytics";

export function calculateTopRestaurants(orders: Order[]): RestaurantStat[] {
  const map = new Map<string, RestaurantStat>();
  for (const o of orders) {
    const cur = map.get(o.restaurant.id) ?? {
      restaurantId: o.restaurant.id,
      name: o.restaurant.name,
      area: o.restaurant.area,
      cuisine: o.restaurant.cuisine,
      orderCount: 0,
      spendPaise: 0,
    };
    cur.orderCount += 1;
    cur.spendPaise += o.total;
    map.set(o.restaurant.id, cur);
  }
  return Array.from(map.values()).sort((a, b) => b.orderCount - a.orderCount);
}

export function topRestaurant(orders: Order[]): RestaurantStat | null {
  const all = calculateTopRestaurants(orders);
  return all[0] ?? null;
}
