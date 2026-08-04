/**
 * Self-check for the Swiggy → Order mapper. Runs mapOrder over a real
 * /dapi/order/all response and asserts the money/parse path.
 *   pnpm tsx scripts/test-dapi-map.ts [path-to-all.json]
 * Defaults to ~/Downloads/all.json; skips (exit 0) if the file is absent.
 */
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { mapOrder, mapCuisine } from "../src/lib/swiggy/dapi";
import { CUISINE_LABEL, type PaymentMethod } from "../src/types/order";

const path = process.argv[2] ?? join(homedir(), "Downloads", "all.json");
if (!existsSync(path)) {
  console.log(`skip: ${path} not found`);
  process.exit(0);
}

const raw = JSON.parse(readFileSync(path, "utf-8")).data.orders as Record<string, unknown>[];
assert(raw.length > 0, "expected at least one order");

const PAYMENTS: PaymentMethod[] = ["UPI", "CARD", "CASH", "WALLET", "NETBANKING"];

for (const r of raw) {
  const o = mapOrder(r, "u1");
  assert(o.total === Math.round(Number(r.order_total) * 100), `total paise mismatch on ${o.id}`);
  assert(o.items.length === ((r.order_items as unknown[]) ?? []).length, `item count mismatch on ${o.id}`);
  assert(o.restaurant.cuisine in CUISINE_LABEL, `bad cuisine on ${o.id}`);
  assert(PAYMENTS.includes(o.paymentMethod), `bad payment on ${o.id}`);
  assert(!Number.isNaN(Date.parse(o.placedAt)), `bad placedAt on ${o.id}`);
  assert(o.deliveredAt === null || !Number.isNaN(Date.parse(o.deliveredAt)), `bad deliveredAt on ${o.id}`);
}

// spot-check the documented sample order
const sample = raw.find((r) => String(r.order_id) === "239809135303654");
if (sample) {
  const o = mapOrder(sample, "u1");
  assert(o.total === 27000, `sample total expected 27000, got ${o.total}`);
  assert(o.paymentMethod === "CARD", `sample payment expected CARD, got ${o.paymentMethod}`);
}

assert(mapCuisine(["Weird", "Snacks"]) === "STREET_FOOD", "cuisine fallback failed");
assert(mapCuisine([]) === "STREET_FOOD", "empty cuisine fallback failed");

console.log(`ok: mapped ${raw.length} orders`);
