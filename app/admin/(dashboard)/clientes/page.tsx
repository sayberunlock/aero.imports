import { Users } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true, favorites: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Clientes</h1>
      <p className="mt-1 text-sm text-steel">{customers.length} cliente(s) cadastrado(s).</p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-cloud shadow-card">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-steel">
            <Users size={28} />
            <p className="text-sm">Nenhum cliente cadastrado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">E-mail</th>
                <th className="px-6 py-3 font-medium">Telefone</th>
                <th className="px-6 py-3 font-medium">Pedidos</th>
                <th className="px-6 py-3 font-medium">Favoritos</th>
                <th className="px-6 py-3 font-medium">Desde</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-4 text-ink">{c.name}</td>
                  <td className="px-6 py-4 text-steel">{c.email}</td>
                  <td className="px-6 py-4 text-steel">{c.phone ?? "—"}</td>
                  <td className="px-6 py-4 text-steel">{c._count.orders}</td>
                  <td className="px-6 py-4 text-steel">{c._count.favorites}</td>
                  <td className="px-6 py-4 text-steel">{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
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
