import { db } from "@/lib/db";
import { NewToggle } from "@/components/admin/NewToggle";

export const dynamic = "force-dynamic";

export default async function AdminNovidadesPage() {
  const products = await db.product.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Novidades</h1>
      <p className="mt-1 text-sm text-steel">
        Escolha quais produtos aparecem na página pública de Novidades (selo &quot;Novo&quot;).
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-cloud shadow-card">
        {products.length === 0 ? (
          <p className="px-6 py-16 text-center text-sm text-steel">
            Nenhum produto cadastrado ainda. Cadastre produtos em Admin → Produtos primeiro.
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Produto</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium text-right">Selo</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-4 text-ink">{p.name}</td>
                  <td className="px-6 py-4 text-steel">{p.category?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-right">
                    <NewToggle id={p.id} isNew={p.isNew} />
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
