import type { Cuisine } from "./order";

export interface MonthlySpendBucket {
  monthKey: string;
  monthLabel: string;
  year: number;
  totalPaise: number;
  orderCount: number;
}

export interface CuisineStat {
  cuisine: Cuisine;
  orderCount: number;
  spendPaise: number;
  percentage: number;
}

export interface RepeatedItem {
  name: string;
  count: number;
  totalSpendPaise: number;
  restaurants: string[];
}

export interface LateNightStat {
  count: number;
  total: number;
  percentage: number;
  topItem: string | null;
}

export interface DeliveryFeeStat {
  totalFeesPaise: number;
  totalSpendPaise: number;
  percentage: number;
}

export interface AOVStat {
  aovPaise: number;
  orderCount: number;
}

export interface RestaurantStat {
  restaurantId: string;
  name: string;
  area: string;
  cuisine: Cuisine;
  orderCount: number;
  spendPaise: number;
}

export interface DayOfWeekStat {
  day: string;
  orderCount: number;
}

export interface HourOfDayStat {
  hour: number;
  orderCount: number;
}

export type InsightTone = "neutral" | "positive" | "warn";

export interface Insight {
  id: string;
  icon: string;
  title: string;
  body: string;
  tone: InsightTone;
}

export interface DashboardSummary {
  totalSpendPaise: number;
  totalOrders: number;
  aov: AOVStat;
  monthlySpend: MonthlySpendBucket[];
  topCuisines: CuisineStat[];
  topRestaurant: RestaurantStat | null;
  deliveryFees: DeliveryFeeStat;
  dayOfWeek: DayOfWeekStat[];
  hourOfDay: HourOfDayStat[];
}

export interface WrappedSummary {
  year: number;
  totalOrders: number;
  totalSpendPaise: number;
  favoriteCuisine: CuisineStat | null;
  topRestaurant: RestaurantStat | null;
  topItem: RepeatedItem | null;
  lateNight: LateNightStat;
  deliveryFees: DeliveryFeeStat;
  biggestMonth: MonthlySpendBucket | null;
  averageOrderValue: AOVStat;
}
