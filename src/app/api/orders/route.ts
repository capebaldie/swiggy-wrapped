import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getOrders } from "@/lib/swiggy/orders";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
  const cursor = searchParams.get("cursor") ?? undefined;
  const cuisine = searchParams.get("cuisine") ?? undefined;

  const { orders, nextCursor } = await getOrders({
    userId: session.userId,
    limit,
    cursor,
    cuisine,
  });

  return NextResponse.json({ orders, nextCursor });
}
