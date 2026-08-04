import type { Order } from "@/types/order";

/** Distinct years present in the orders, newest first. */
export function availableYears(orders: Order[]): number[] {
  const set = new Set<number>();
  for (const o of orders) set.add(new Date(o.placedAt).getUTCFullYear());
  return [...set].sort((a, b) => b - a);
}

/** Orders in a given year, or all orders when year is "all". */
export function filterByYear(orders: Order[], year: number | "all"): Order[] {
  if (year === "all") return orders;
  return orders.filter((o) => new Date(o.placedAt).getUTCFullYear() === year);
}
