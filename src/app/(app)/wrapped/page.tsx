import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";
import { buildWrappedSummary } from "@/lib/analytics";
import { WrappedStory } from "@/components/WrappedStory";

export default async function WrappedPage() {
  const session = await getSession();
  if (!session) redirect("/");
  const client = getMcpClient();
  const orders = await client.fetchAllOrders(session.userId);
  const summary = buildWrappedSummary(orders);
  return <WrappedStory summary={summary} user={session.user} />;
}
