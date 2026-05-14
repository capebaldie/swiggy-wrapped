import type { Order } from "@/types/order";
import type { DashboardSummary, WrappedSummary } from "@/types/analytics";
import { calculateMonthlySpend, biggestMonth } from "./monthly-spend";
import { calculateFavoriteCuisine } from "./favorite-cuisine";
import { calculateRepeatedItems } from "./repeated-items";
import { calculateLateNightOrders } from "./late-night";
import { calculateDeliveryFeePercentage } from "./delivery-fees";
import { calculateAverageOrderValue } from "./average-order-value";
import { calculateDayOfWeek, calculateHourOfDay } from "./temporal";
import { topRestaurant } from "./restaurants";

export { calculateMonthlySpend, biggestMonth };
export { calculateFavoriteCuisine };
export { calculateRepeatedItems };
export { calculateLateNightOrders };
export { calculateDeliveryFeePercentage };
export { calculateAverageOrderValue };
export { calculateDayOfWeek, calculateHourOfDay, topDayOfWeek } from "./temporal";
export { calculateTopRestaurants, topRestaurant } from "./restaurants";
export { generateInsights } from "./insights";

export function buildDashboardSummary(orders: Order[]): DashboardSummary {
  const now = new Date();
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  let monthSpend = 0;
  let yearSpend = 0;
  for (const o of orders) {
    const d = new Date(o.placedAt);
    if (d.getUTCFullYear() === now.getUTCFullYear()) yearSpend += o.total;
    const okey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    if (okey === ym) monthSpend += o.total;
  }

  // fallback for demo: use the most recent month present in the data if current month has nothing
  if (monthSpend === 0 && orders.length > 0) {
    const monthly = calculateMonthlySpend(orders);
    const last = monthly[monthly.length - 1];
    monthSpend = last?.totalPaise ?? 0;
  }
  if (yearSpend === 0 && orders.length > 0) {
    yearSpend = orders.reduce((s, o) => s + o.total, 0);
  }

  return {
    monthSpendPaise: monthSpend,
    yearSpendPaise: yearSpend,
    totalOrders: orders.length,
    aov: calculateAverageOrderValue(orders),
    monthlySpend: calculateMonthlySpend(orders),
    topCuisines: calculateFavoriteCuisine(orders).slice(0, 3),
    topRestaurant: topRestaurant(orders),
    deliveryFees: calculateDeliveryFeePercentage(orders),
    dayOfWeek: calculateDayOfWeek(orders),
    hourOfDay: calculateHourOfDay(orders),
  };
}

export function buildWrappedSummary(orders: Order[]): WrappedSummary {
  const repeated = calculateRepeatedItems(orders);
  const cuisines = calculateFavoriteCuisine(orders);
  const totalSpend = orders.reduce((s, o) => s + o.total, 0);
  const lastYear = orders.length > 0 ? new Date(orders[0].placedAt).getUTCFullYear() : new Date().getUTCFullYear();

  return {
    year: lastYear,
    totalOrders: orders.length,
    totalSpendPaise: totalSpend,
    favoriteCuisine: cuisines[0] ?? null,
    topRestaurant: topRestaurant(orders),
    topItem: repeated[0] ?? null,
    lateNight: calculateLateNightOrders(orders),
    deliveryFees: calculateDeliveryFeePercentage(orders),
    biggestMonth: biggestMonth(orders),
    averageOrderValue: calculateAverageOrderValue(orders),
  };
}
