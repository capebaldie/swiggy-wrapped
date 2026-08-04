import { cookies } from "next/headers";
import type { Order } from "@/types/order";
import { SWIGGY_COOKIE } from "@/lib/cookies";
import { SwiggyAuthError, fetchAllRawOrders, mapOrder } from "./dapi";

export interface OrderQuery {
  userId: string;
  from?: Date;
  to?: Date;
  limit?: number;
  cursor?: string;
  cuisine?: string;
}

// ponytail: process-memory cache keyed by cookie, 5-min TTL, no cross-instance
// invalidation — swap for Redis if this ever runs multi-instance.
const TTL_MS = 5 * 60 * 1000;
let cache: { cookie: string; at: number; orders: Order[] } | null = null;

/** Every order the signed-in user's Swiggy cookie can see, newest first. */
export async function getAllOrders(userId: string): Promise<Order[]> {
  const cookie = (await cookies()).get(SWIGGY_COOKIE)?.value;
  if (!cookie) return [];
  if (cache && cache.cookie === cookie && Date.now() - cache.at < TTL_MS) return cache.orders;

  try {
    const orders = (await fetchAllRawOrders(cookie))
      .map((r) => mapOrder(r, userId))
      .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
    cache = { cookie, at: Date.now(), orders };
    return orders;
  } catch (e) {
    // ponytail: expired cookie -> empty list (no crash). The user reconnects in Settings;
    // surfacing a banner per-page would touch every server component. Upgrade if that UX matters.
    if (e instanceof SwiggyAuthError) return [];
    throw e;
  }
}

/** Filtered, cursor-paginated slice of the order history. */
export async function getOrders({
  userId,
  from,
  to,
  cuisine,
  cursor,
  limit = 20,
}: OrderQuery): Promise<{ orders: Order[]; nextCursor: string | null }> {
  let filtered = await getAllOrders(userId);
  if (from) filtered = filtered.filter((o) => new Date(o.placedAt) >= from);
  if (to) filtered = filtered.filter((o) => new Date(o.placedAt) <= to);
  if (cuisine) filtered = filtered.filter((o) => o.restaurant.cuisine === cuisine);

  const start = cursor ? filtered.findIndex((o) => o.id === cursor) + 1 : 0;
  const page = filtered.slice(start, start + limit);
  const nextCursor = start + limit < filtered.length ? page[page.length - 1].id : null;
  return { orders: page, nextCursor };
}

export async function getOrder(userId: string, orderId: string): Promise<Order | null> {
  const all = await getAllOrders(userId);
  return all.find((o) => o.id === orderId) ?? null;
}
