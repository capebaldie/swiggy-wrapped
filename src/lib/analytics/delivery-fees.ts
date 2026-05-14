import type { Order } from "@/types/order";
import type { DeliveryFeeStat } from "@/types/analytics";

export function calculateDeliveryFeePercentage(orders: Order[]): DeliveryFeeStat {
  if (orders.length === 0) {
    return { totalFeesPaise: 0, totalSpendPaise: 0, percentage: 0 };
  }
  let fees = 0;
  let spend = 0;
  for (const o of orders) {
    fees += o.deliveryFee;
    spend += o.total;
  }
  return {
    totalFeesPaise: fees,
    totalSpendPaise: spend,
    percentage: spend > 0 ? Math.round((fees / spend) * 100) : 0,
  };
}
