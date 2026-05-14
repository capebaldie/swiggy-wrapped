import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = getMcpClient();
  const order = await client.fetchOrderDetails({ userId: session.userId, orderId: id });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
