import type { Order } from "@/types/order";

export interface FetchOrdersParams {
  userId: string;
  from?: Date;
  to?: Date;
  limit?: number;
  cursor?: string;
  cuisine?: string;
}

export interface SwiggyMCPClient {
  authorize(userId: string): Promise<{ ok: true } | { ok: false; reason: string }>;
  fetchOrders(params: FetchOrdersParams): Promise<{ orders: Order[]; nextCursor: string | null }>;
  fetchAllOrders(userId: string): Promise<Order[]>;
  fetchOrderDetails(params: { userId: string; orderId: string }): Promise<Order | null>;
}
