import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <Link href="/admin/produtos" className="mb-6 inline-flex items-center gap-2 text-sm text-steel hover:text-ink">
        <ArrowLeft size={16} />
        Voltar para Produtos
      </Link>
      <h1 className="font-display text-2xl font-medium text-ink">Novo produto</h1>
      <p className="mt-1 text-sm text-steel">Preencha os dados abaixo para cadastrar um novo produto no catálogo.</p>

      {categories.length === 0 && (
        <p className="mt-6 max-w-2xl rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Nenhuma categoria cadastrada ainda.{" "}
          <Link href="/admin/categorias" className="font-medium underline">
            Cadastre uma categoria primeiro
          </Link>
          .
        </p>
      )}

      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
