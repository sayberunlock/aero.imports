import Link from "next/link";
import { Plus, Pencil, PackageX } from "lucide-react";
import { db } from "@/lib/db";
import { formatBRL } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Produtos</h1>
          <p className="mt-1 text-sm text-steel">{products.length} produto(s) cadastrado(s).</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-full bg-aero px-5 py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90"
        >
          <Plus size={16} />
          Novo produto
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-cloud shadow-card">
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-steel">
            <PackageX size={28} />
            <p className="text-sm">Nenhum produto cadastrado ainda.</p>
            <Link href="/admin/produtos/novo" className="text-sm font-medium text-signal">
              Cadastrar o primeiro produto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Produto</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium">Preço</th>
                <th className="px-6 py-3 font-medium">Estoque</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-steel">
                      {p.brand} · {p.model}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-steel">{p.category?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-ink">
                    {p.salePriceCents ? (
                      <>
                        <span className="text-xs text-steel line-through">{formatBRL(p.priceCents)}</span>
                        <br />
                        {formatBRL(p.salePriceCents)}
                      </>
                    ) : (
                      formatBRL(p.priceCents)
                    )}
                  </td>
                  <td className="px-6 py-4 text-steel">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-fog px-2.5 py-1 text-xs text-steel">
                      {p.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/produtos/${p.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-signal hover:underline"
                    >
                      <Pencil size={14} />
                      Editar
                    </Link>
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
