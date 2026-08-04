import type { Cuisine, Order, OrderItem, PaymentMethod } from "@/types/order";

/**
 * Swiggy order-history via the private web endpoint
 *   GET https://www.swiggy.com/dapi/order/all?order_id=<lastId>
 * authenticated by the user's swiggy.com login cookies (Cookie header).
 * Paginates 10-at-a-time by the last order_id; ends on empty orders or
 * statusCode === 1 (logged out). Mirrors github.com/teja156/swiggy-total-spent.
 */

const ORDERS_URL = "https://www.swiggy.com/dapi/order/all?order_id=";

const HEADERS: Record<string, string> = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "*/*",
  Referer: "https://www.swiggy.com/my-account/orders",
  "Content-Type": "application/json",
};

export class SwiggyAuthError extends Error {}

async function fetchPage(cookie: string, lastOrderId: string): Promise<Record<string, unknown>[]> {
  const res = await fetch(ORDERS_URL + lastOrderId, {
    headers: { ...HEADERS, Cookie: cookie },
    cache: "no-store",
  });
  const body = (await res.json()) as { statusCode?: number; data?: { orders?: Record<string, unknown>[] } };
  if (body.statusCode === 1) throw new SwiggyAuthError("Swiggy session invalid or expired");
  return body.data?.orders ?? [];
}

/** Fetch every raw order the cookie can see (newest first, as Swiggy returns them). */
export async function fetchAllRawOrders(cookie: string): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let last = "";
  // ponytail: sequential paging (~10/call). Fine for personal use; parallelize only for users with thousands of orders.
  for (;;) {
    const page = await fetchPage(cookie, last);
    if (page.length === 0) break;
    all.push(...page);
    last = String(page[page.length - 1].order_id);
  }
  return all;
}

/** One call to check the cookie is a valid logged-in session. Returns the customer id when available. */
export async function validateCookie(
  cookie: string,
): Promise<{ ok: true; userId: string } | { ok: false; reason: string }> {
  try {
    const page = await fetchPage(cookie, "");
    const customerId = page[0]?.customer_id;
    return { ok: true, userId: customerId != null ? String(customerId) : "swiggy_user" };
  } catch (e) {
    if (e instanceof SwiggyAuthError) return { ok: false, reason: e.message };
    return { ok: false, reason: "Could not reach Swiggy — check the cookie and try again" };
  }
}

// ---- mapping ------------------------------------------------------------

const paise = (n: unknown) => Math.round(Number(n ?? 0) * 100);
const iso = (epochSeconds: unknown) => new Date(Number(epochSeconds) * 1000).toISOString();

// ponytail: static synonym table, extend as unseen cuisines show up.
const CUISINE_MAP: Record<string, Cuisine> = {
  "north indian": "NORTH_INDIAN",
  mughlai: "MUGHLAI",
  "south indian": "SOUTH_INDIAN",
  andhra: "ANDHRA",
  chinese: "CHINESE",
  thai: "THAI",
  biryani: "BIRYANI",
  pizza: "PIZZA",
  burger: "BURGER",
  burgers: "BURGER",
  dessert: "DESSERT",
  desserts: "DESSERT",
  sweets: "DESSERT",
  "ice cream": "DESSERT",
  bakery: "BAKERY",
  beverages: "BEVERAGES",
  shakes: "BEVERAGES",
  juices: "BEVERAGES",
  "street food": "STREET_FOOD",
  snacks: "STREET_FOOD",
  fastfood: "STREET_FOOD",
  "fast food": "STREET_FOOD",
  continental: "CONTINENTAL",
  italian: "CONTINENTAL",
  healthy: "HEALTHY",
  "healthy food": "HEALTHY",
  salads: "HEALTHY",
};

export function mapCuisine(cuisines: unknown): Cuisine {
  const list = Array.isArray(cuisines) ? cuisines : [];
  for (const c of list) {
    const hit = CUISINE_MAP[String(c).trim().toLowerCase()];
    if (hit) return hit;
  }
  return "STREET_FOOD";
}

function mapPayment(raw: Record<string, unknown>): PaymentMethod {
  const txns = (raw.payment_info_v2 as { payment_transactions?: unknown[] } | undefined)?.payment_transactions;
  const type = (
    (txns?.[0] as Record<string, unknown> | undefined)?.primary_payment_sub_transaction_reference as
      | { payment_method?: { type?: string } }
      | undefined
  )?.payment_method?.type;
  switch (type) {
    case "TYPE_CARD":
      return "CARD";
    case "TYPE_UPI":
      return "UPI";
    case "TYPE_WALLET":
      return "WALLET";
    case "TYPE_NETBANKING":
      return "NETBANKING";
    case "TYPE_CASH":
      return "CASH";
  }
  const s = String(raw.payment_method ?? "").toLowerCase();
  if (s.includes("cash")) return "CASH";
  if (s.includes("upi")) return "UPI";
  if (s.includes("wallet")) return "WALLET";
  if (s.includes("net")) return "NETBANKING";
  if (s.includes("card")) return "CARD";
  return "UPI";
}

function mapItems(raw: Record<string, unknown>): OrderItem[] {
  const items = (raw.order_items as Record<string, unknown>[] | undefined) ?? [];
  return items.map((it, i) => {
    const quantity = Math.max(1, Number(it.quantity ?? 1));
    const subtotal = paise(it.subtotal ?? it.total ?? 0);
    return {
      id: String(it.item_id ?? `${raw.order_id}_${i}`),
      name: String(it.name ?? "Item"),
      quantity,
      unitPrice: Math.round(subtotal / quantity),
      isVeg: String(it.is_veg) === "1",
    };
  });
}

export function mapOrder(raw: Record<string, unknown>, userId: string): Order {
  const hasRating = String(raw.has_rating) !== "0" && Number(raw.restaurant_order_rating) > 0;
  const delivered = raw.delivered_time_in_seconds;
  return {
    id: String(raw.order_id),
    userId,
    placedAt: iso(raw.ordered_time_in_seconds),
    deliveredAt: delivered ? iso(delivered) : null,
    restaurant: {
      id: String(raw.restaurant_id),
      name: String(raw.restaurant_name ?? "Restaurant"),
      cuisine: mapCuisine(raw.restaurant_cuisine),
      area: String(raw.restaurant_area_name ?? raw.restaurant_locality ?? ""),
      city: String(raw.restaurant_city_name ?? ""),
      rating: 0,
    },
    items: mapItems(raw),
    subtotal: paise(raw.item_total),
    deliveryFee: paise(raw.order_delivery_charge),
    packagingFee: paise(raw.restaurant_packing_charges),
    taxes: paise(raw.order_tax),
    discount: paise(raw.order_discount),
    total: paise(raw.order_total),
    paymentMethod: mapPayment(raw),
    rating: hasRating ? Number(raw.restaurant_order_rating) : null,
  };
}
