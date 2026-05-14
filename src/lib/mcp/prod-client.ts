import type { FetchOrdersParams, SwiggyMCPClient } from "./client";
import type { Order } from "@/types/order";

/**
 * Production client targeting Swiggy MCP (https://mcp.swiggy.com/builders).
 *
 * Real implementation will call MCP tools such as:
 *   - swiggy.orders.list({ userId, from, to, limit, cursor })
 *   - swiggy.orders.get({ orderId })
 *   - swiggy.auth.authorize({ userId, scopes: ["orders:read"] })
 *
 * Replace stubs with real fetch / MCP SDK calls before going live.
 */
export class ProdClient implements SwiggyMCPClient {
  async authorize(): Promise<{ ok: false; reason: string }> {
    return { ok: false, reason: "Prod MCP client not yet implemented" };
  }
  async fetchAllOrders(): Promise<Order[]> {
    throw new Error("Prod MCP client not yet implemented");
  }
  async fetchOrders(_params: FetchOrdersParams): Promise<{ orders: Order[]; nextCursor: string | null }> {
    throw new Error("Prod MCP client not yet implemented");
  }
  async fetchOrderDetails(): Promise<Order | null> {
    throw new Error("Prod MCP client not yet implemented");
  }
}
