import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";
import { CuisineBadge } from "@/components/CuisineBadge";
import { formatINR, formatDate, formatTime } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/");
  const { id } = await params;
  const client = getMcpClient();
  const order = await client.fetchOrderDetails({ userId: session.userId, orderId: id });
  if (!order) notFound();

  return (
    <div className="px-5 pt-6">
      <Link
        href="/orders"
        className="inline-flex h-9 items-center gap-1 rounded-full bg-surface px-3 text-[12.5px] font-semibold text-text-primary shadow-card"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </Link>

      <header className="mt-5">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary">{order.restaurant.name}</h1>
          <CuisineBadge cuisine={order.restaurant.cuisine} />
        </div>
        <p className="mt-1 text-[13px] text-text-muted">
          {order.restaurant.area} · {order.restaurant.city}
          {order.restaurant.rating ? ` · ★ ${order.restaurant.rating.toFixed(1)}` : ""}
        </p>
        <p className="mt-2 text-[12px] text-text-muted">
          {formatDate(order.placedAt)} · {formatTime(order.placedAt)}
        </p>
      </header>

      <section className="mt-5 rounded-2xl bg-surface p-4 shadow-card">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Items</h2>
        <ul className="mt-3 divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-start gap-2">
                <span
                  className={
                    "mt-1.5 inline-block h-2 w-2 shrink-0 rounded-[2px] " +
                    (item.isVeg ? "bg-success" : "bg-error")
                  }
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-medium text-text-primary">{item.name}</div>
                  <div className="text-[11px] text-text-muted">Qty {item.quantity}</div>
                </div>
              </div>
              <div className="shrink-0 text-[14px] font-semibold text-text-primary">
                {formatINR(item.unitPrice * item.quantity)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5 rounded-2xl bg-surface p-4 shadow-card">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Bill</h2>
        <dl className="mt-3 space-y-2 text-[14px]">
          <Row label="Item subtotal" value={formatINR(order.subtotal)} />
          <Row label="Delivery fee" value={formatINR(order.deliveryFee)} />
          <Row label="Packaging" value={formatINR(order.packagingFee)} />
          <Row label="GST & taxes" value={formatINR(order.taxes)} />
          {order.discount > 0 ? (
            <Row label="Discount" value={`− ${formatINR(order.discount)}`} accent />
          ) : null}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[15px] font-semibold">
            <dt className="text-text-primary">Total paid</dt>
            <dd className="text-text-primary">{formatINR(order.total)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-[11px] text-text-muted">
          Paid via {order.paymentMethod.toLowerCase().replace("_", " ")}
        </p>
      </section>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-text-muted">{label}</dt>
      <dd className={accent ? "font-medium text-success" : "text-text-primary"}>{value}</dd>
    </div>
  );
}
