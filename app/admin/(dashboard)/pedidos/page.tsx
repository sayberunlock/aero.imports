import { ShoppingCart } from "lucide-react";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Pedidos</h1>
      <p className="mt-1 text-sm text-steel">{orders.length} pedido(s) recebido(s).</p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-cloud shadow-card">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-steel">
            <ShoppingCart size={28} />
            <p className="text-sm">Nenhum pedido recebido ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Pedido</th>
                <th className="px-6 py-3 font-medium">Cliente</th>
                <th className="px-6 py-3 font-medium">Itens</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{order.number}</p>
                    <p className="text-xs text-steel">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</p>
                  </td>
                  <td className="px-6 py-4 text-steel">
                    <p className="text-ink">{order.user.name}</p>
                    <p className="text-xs">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-steel">{order.items.length} item(ns)</td>
                  <td className="px-6 py-4 text-ink">{formatBRL(order.totalCents)}</td>
                  <td className="px-6 py-4">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
