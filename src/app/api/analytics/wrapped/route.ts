import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAllOrders } from "@/lib/swiggy/orders";
import { buildWrappedSummary } from "@/lib/analytics";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await getAllOrders(session.userId);
  const wrapped = buildWrappedSummary(orders);
  return NextResponse.json({ wrapped, user: session.user });
}
