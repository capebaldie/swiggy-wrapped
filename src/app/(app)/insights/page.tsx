import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";
import {
  calculateDayOfWeek,
  calculateHourOfDay,
  calculateRepeatedItems,
  calculateTopRestaurants,
  generateInsights,
} from "@/lib/analytics";
import { InsightCard } from "@/components/InsightCard";
import { EmptyState } from "@/components/EmptyState";
import { formatINR, formatINRCompact } from "@/lib/utils";

export default async function InsightsPage() {
  const session = await getSession();
  if (!session) redirect("/");
  const client = getMcpClient();
  const orders = await client.fetchAllOrders(session.userId);
  const insights = generateInsights(orders);
  const repeated = calculateRepeatedItems(orders).slice(0, 6);
  const restaurants = calculateTopRestaurants(orders).slice(0, 5);
  const dow = calculateDayOfWeek(orders);
  const hod = calculateHourOfDay(orders);
  const maxDow = Math.max(1, ...dow.map((d) => d.orderCount));
  const maxHod = Math.max(1, ...hod.map((h) => h.orderCount));

  return (
    <div className="px-5 pt-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">Insights</p>
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-text-primary">What we noticed</h1>
      </header>

      <section className="mt-5 space-y-3">
        {insights.length === 0 ? (
          <EmptyState icon="🤔" title="Not enough data yet" body="Place a few more orders to unlock insights." />
        ) : (
          insights.map((ins) => <InsightCard key={ins.id} insight={ins} />)
        )}
      </section>

      <section className="mt-8 rounded-2xl bg-surface p-4 shadow-card">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Day of week</h2>
        <div className="mt-4 flex items-end justify-between gap-1.5">
          {dow.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-md bg-accent/85"
                style={{ height: `${Math.max(8, (d.orderCount / maxDow) * 90)}px` }}
              />
              <div className="text-[10px] font-medium text-text-muted">{d.day.slice(0, 1)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl bg-surface p-4 shadow-card">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Hour of day</h2>
        <div className="mt-4 grid grid-cols-12 gap-1">
          {hod.map((h) => (
            <div
              key={h.hour}
              className="aspect-square rounded-md"
              style={{
                backgroundColor: `rgba(224,122,60,${0.1 + 0.85 * (h.orderCount / maxHod)})`,
              }}
              title={`${h.hour}:00 — ${h.orderCount} orders`}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>11pm</span>
        </div>
      </section>

      {repeated.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Most ordered items</h2>
          <div className="mt-3 space-y-2">
            {repeated.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-card"
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-text-primary">{item.name}</div>
                  <div className="text-[11px] text-text-muted">
                    Total spent {formatINRCompact(item.totalSpendPaise)}
                  </div>
                </div>
                <div className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-text-primary">
                  ×{item.count}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {restaurants.length > 0 && (
        <section className="mt-6">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Top restaurants</h2>
          <div className="mt-3 space-y-2">
            {restaurants.map((r) => (
              <div
                key={r.restaurantId}
                className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-card"
              >
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold text-text-primary">{r.name}</div>
                  <div className="text-[11px] text-text-muted">
                    {r.area} · {r.orderCount} orders · avg {formatINR(Math.round(r.spendPaise / r.orderCount))}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-semibold text-text-primary">
                  {formatINRCompact(r.spendPaise)}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
