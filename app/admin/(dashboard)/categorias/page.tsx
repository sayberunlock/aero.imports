import { db } from "@/lib/db";
import { CategoryManager } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Categorias</h1>
      <p className="mt-1 text-sm text-steel">
        Organize os produtos por categoria. As categorias aparecem nos filtros do catálogo.
      </p>

      <div className="mt-8">
        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
