import Link from "next/link";
import { CuisineBadge } from "./CuisineBadge";
import type { Order } from "@/types/order";
import { formatINR, formatDateShort, formatTime } from "@/lib/utils";

export function OrderCard({ order }: { order: Order }) {
  const itemPreview = order.items
    .slice(0, 2)
    .map((it) => (it.quantity > 1 ? `${it.name} ×${it.quantity}` : it.name))
    .join(" · ");
  const extra = order.items.length > 2 ? ` +${order.items.length - 2} more` : "";

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-2xl bg-surface p-4 shadow-card transition-transform active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-text-primary">{order.restaurant.name}</h3>
            <CuisineBadge cuisine={order.restaurant.cuisine} />
          </div>
          <p className="mt-1 line-clamp-1 text-[13px] text-text-muted">{itemPreview}{extra}</p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-text-muted">
            <span>{formatDateShort(order.placedAt)}</span>
            <span aria-hidden>·</span>
            <span>{formatTime(order.placedAt)}</span>
            <span aria-hidden>·</span>
            <span className="uppercase tracking-wide">{order.paymentMethod}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[15px] font-semibold text-text-primary">{formatINR(order.total)}</div>
          <div className="mt-1 text-[11px] text-text-muted">+₹{Math.round(order.deliveryFee / 100)} fee</div>
        </div>
      </div>
    </Link>
  );
}
