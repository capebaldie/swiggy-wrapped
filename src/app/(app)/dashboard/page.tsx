import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";
import { buildDashboardSummary } from "@/lib/analytics";
import { StatCard } from "@/components/StatCard";
import { SpendingChart } from "@/components/SpendingChart";
import { OrderCard } from "@/components/OrderCard";
import { CuisineBadge } from "@/components/CuisineBadge";
import { formatINR, formatINRCompact } from "@/lib/utils";
import { CUISINE_LABEL } from "@/types/order";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const client = getMcpClient();
  const orders = await client.fetchAllOrders(session.userId);
  const summary = buildDashboardSummary(orders);
  const recent = orders.slice(0, 3);
  const top = summary.topCuisines[0];

  return (
    <div className="px-5 pt-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">Hi {session.user.name.split(" ")[0]}</p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight text-text-primary">Your food year</h1>
        </div>
        <Link
          href="/wrapped"
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-accent px-3.5 text-[12.5px] font-semibold text-white shadow-card"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Wrapped
        </Link>
      </header>

      <section className="mt-5 grid grid-cols-2 gap-3">
        <StatCard label="This month" value={formatINR(summary.monthSpendPaise)} accent />
        <StatCard label="This year" value={formatINRCompact(summary.yearSpendPaise)} />
        <StatCard label="Orders" value={summary.totalOrders} />
        <StatCard label="Avg order" value={formatINR(summary.aov.aovPaise)} />
      </section>

      <section className="mt-6 rounded-2xl bg-surface p-4 shadow-card">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Monthly spend</h2>
          <span className="text-[11px] text-text-muted">{summary.monthlySpend.length} months</span>
        </div>
        <div className="mt-3">
          <SpendingChart data={summary.monthlySpend} variant="bar" height={180} />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3">
        {top ? (
          <div className="rounded-2xl bg-surface p-4 shadow-card">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Top cuisine</div>
            <div className="mt-2 flex items-center gap-3">
              <CuisineBadge cuisine={top.cuisine} size="md" />
              <div className="text-sm text-text-muted">
                {top.orderCount} orders · {formatINRCompact(top.spendPaise)}
              </div>
            </div>
            <div className="mt-3 text-[13px] text-text-muted text-balance">
              {CUISINE_LABEL[top.cuisine]} made up {top.percentage}% of your orders this year.
            </div>
          </div>
        ) : null}
        {summary.topRestaurant ? (
          <div className="rounded-2xl bg-surface p-4 shadow-card">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Favourite restaurant</div>
            <div className="mt-2 text-base font-semibold text-text-primary">{summary.topRestaurant.name}</div>
            <div className="mt-1 text-[13px] text-text-muted">
              {summary.topRestaurant.area} · {summary.topRestaurant.orderCount} orders · {formatINRCompact(summary.topRestaurant.spendPaise)}
            </div>
          </div>
        ) : null}
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-muted">Recent orders</h2>
          <Link href="/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      </section>
    </div>
  );
}
