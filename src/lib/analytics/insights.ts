import type { Order } from "@/types/order";
import type { Insight } from "@/types/analytics";
import { CUISINE_LABEL } from "@/types/order";
import { calculateLateNightOrders } from "./late-night";
import { calculateDeliveryFeePercentage } from "./delivery-fees";
import { calculateFavoriteCuisine } from "./favorite-cuisine";
import { calculateRepeatedItems } from "./repeated-items";
import { calculateMonthlySpend, biggestMonth } from "./monthly-spend";
import { topDayOfWeek } from "./temporal";
import { topRestaurant } from "./restaurants";
import { formatINR, formatINRCompact } from "@/lib/utils";

export function generateInsights(orders: Order[]): Insight[] {
  if (orders.length === 0) return [];

  const insights: Insight[] = [];
  const late = calculateLateNightOrders(orders);
  const fees = calculateDeliveryFeePercentage(orders);
  const cuisines = calculateFavoriteCuisine(orders);
  const repeated = calculateRepeatedItems(orders);
  const monthly = calculateMonthlySpend(orders);
  const big = biggestMonth(orders);
  const topDay = topDayOfWeek(orders);
  const topResto = topRestaurant(orders);

  if (topDay && topDay.orderCount > 0) {
    insights.push({
      id: "top-day",
      icon: "📅",
      title: `You order most on ${topDay.day}days`,
      body: `${topDay.orderCount} of your ${orders.length} orders landed on a ${topDay.day}.`,
      tone: "neutral",
    });
  }

  if (late.percentage > 12) {
    insights.push({
      id: "night-owl",
      icon: "🌙",
      title: "You're a night owl",
      body: `${late.percentage}% of your orders came in after 10pm${late.topItem ? ` — usually ${late.topItem}` : ""}.`,
      tone: "warn",
    });
  } else if (late.percentage < 5 && orders.length > 30) {
    insights.push({
      id: "early-bird",
      icon: "🌅",
      title: "Early bird energy",
      body: `Only ${late.percentage}% of your orders are late-night. Most folks order after 10pm.`,
      tone: "positive",
    });
  }

  if (fees.percentage >= 10) {
    insights.push({
      id: "delivery-fee",
      icon: "🛵",
      title: "Delivery fees add up",
      body: `Fees were ${fees.percentage}% of your spend — ${formatINR(fees.totalFeesPaise)} this year. A Swiggy One trial could save you most of that.`,
      tone: "warn",
    });
  }

  if (cuisines.length && cuisines[0].percentage >= 30) {
    insights.push({
      id: "favorite-cuisine",
      icon: "❤️",
      title: `You love ${CUISINE_LABEL[cuisines[0].cuisine]}`,
      body: `${cuisines[0].percentage}% of your orders are ${CUISINE_LABEL[cuisines[0].cuisine]} — ${cuisines[0].orderCount} orders worth ${formatINRCompact(cuisines[0].spendPaise)}.`,
      tone: "positive",
    });
  }

  if (repeated.length && repeated[0].count >= 6) {
    insights.push({
      id: "comfort-food",
      icon: "🍽️",
      title: "Comfort food alert",
      body: `${repeated[0].name} × ${repeated[0].count}. That's a lot of love.`,
      tone: "positive",
    });
  }

  if (big) {
    insights.push({
      id: "biggest-month",
      icon: "📈",
      title: `${big.monthLabel} ${big.year} was your peak`,
      body: `You spent ${formatINR(big.totalPaise)} across ${big.orderCount} orders that month.`,
      tone: "neutral",
    });
  }

  if (topResto) {
    insights.push({
      id: "top-restaurant",
      icon: "🏆",
      title: `${topResto.name} is your go-to`,
      body: `${topResto.orderCount} orders, ${formatINRCompact(topResto.spendPaise)} spent — more than any other restaurant.`,
      tone: "positive",
    });
  }

  // AOV trend over last 3 months
  if (monthly.length >= 3) {
    const last3 = monthly.slice(-3);
    const aovs = last3.map((m) => m.totalPaise / Math.max(m.orderCount, 1));
    if (aovs[0] < aovs[1] && aovs[1] < aovs[2]) {
      insights.push({
        id: "aov-trend",
        icon: "💸",
        title: "Order values trending up",
        body: "Your average order has crept up each of the last three months.",
        tone: "warn",
      });
    }
  }

  return insights;
}
