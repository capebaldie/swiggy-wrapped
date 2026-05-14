import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getMcpClient } from "@/lib/mcp";
import { OrdersListClient } from "@/components/OrdersListClient";

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/");
  const client = getMcpClient();
  const orders = await client.fetchAllOrders(session.userId);

  return (
    <div className="px-5 pt-6">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
          All orders
        </p>
        <h1 className="mt-1 font-serif text-3xl tracking-tight text-text-primary">
          {orders.length} orders
        </h1>
      </header>
      <OrdersListClient orders={orders} />
    </div>
  );
}
