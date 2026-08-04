import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getAllOrders } from "@/lib/swiggy/orders";
import { buildWrappedSummary } from "@/lib/analytics";
import { availableYears, filterByYear } from "@/lib/analytics/years";
import { WrappedStory } from "@/components/WrappedStory";

// Wrapped is per-year by nature. Defaults to the most recent year; ?year= picks another.
export default async function WrappedPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/");
  const allOrders = await getAllOrders(session.userId);
  const years = availableYears(allOrders);
  const yearParam = (await searchParams).year;
  const year = yearParam && years.includes(Number(yearParam)) ? Number(yearParam) : years[0];
  const orders = year ? filterByYear(allOrders, year) : allOrders;
  const summary = buildWrappedSummary(orders);
  return <WrappedStory summary={summary} user={session.user} />;
}
