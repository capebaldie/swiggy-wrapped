import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";
import { buildWrappedSummary } from "@/lib/analytics";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = getMcpClient();
  const orders = await client.fetchAllOrders(session.userId);
  const wrapped = buildWrappedSummary(orders);
  return NextResponse.json({ wrapped, user: session.user });
}
