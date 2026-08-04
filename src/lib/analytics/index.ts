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

// Callers scope `orders` to the selected year before calling — see lib/analytics/years.ts.
export function buildDashboardSummary(orders: Order[]): DashboardSummary {
  return {
    totalSpendPaise: orders.reduce((s, o) => s + o.total, 0),
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
