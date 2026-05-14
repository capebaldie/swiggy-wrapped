import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MockDataset, Order } from "@/types/order";
import type { FetchOrdersParams, SwiggyMCPClient } from "./client";

let cache: MockDataset | null = null;

function load(): MockDataset {
  if (cache) return cache;
  const path = join(process.cwd(), "data", "mock-orders.json");
  const raw = readFileSync(path, "utf-8");
  cache = JSON.parse(raw) as MockDataset;
  return cache;
}

export class MockClient implements SwiggyMCPClient {
  async authorize(): Promise<{ ok: true }> {
    return { ok: true };
  }

  async fetchAllOrders(userId: string): Promise<Order[]> {
    const dataset = load();
    if (dataset.user.id !== userId) return [];
    return dataset.orders;
  }

  async fetchOrders(params: FetchOrdersParams): Promise<{ orders: Order[]; nextCursor: string | null }> {
    const all = await this.fetchAllOrders(params.userId);
    let filtered = all;
    if (params.from) filtered = filtered.filter((o) => new Date(o.placedAt) >= params.from!);
    if (params.to) filtered = filtered.filter((o) => new Date(o.placedAt) <= params.to!);
    if (params.cuisine) filtered = filtered.filter((o) => o.restaurant.cuisine === params.cuisine);

    let startIdx = 0;
    if (params.cursor) {
      const idx = filtered.findIndex((o) => o.id === params.cursor);
      if (idx >= 0) startIdx = idx + 1;
    }
    const limit = params.limit ?? 20;
    const page = filtered.slice(startIdx, startIdx + limit);
    const nextCursor = startIdx + limit < filtered.length ? page[page.length - 1].id : null;
    return { orders: page, nextCursor };
  }

  async fetchOrderDetails({ userId, orderId }: { userId: string; orderId: string }): Promise<Order | null> {
    const all = await this.fetchAllOrders(userId);
    return all.find((o) => o.id === orderId) ?? null;
  }
}
