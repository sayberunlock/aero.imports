import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: params.id },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/produtos" className="mb-6 inline-flex items-center gap-2 text-sm text-steel hover:text-ink">
        <ArrowLeft size={16} />
        Voltar para Produtos
      </Link>
      <h1 className="font-display text-2xl font-medium text-ink">Editar produto</h1>
      <p className="mt-1 text-sm text-steel">{product.name}</p>

      <div className="mt-8">
        <ProductForm
          categories={categories}
          initial={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            brand: product.brand,
            model: product.model,
            description: product.description,
            priceCents: product.priceCents,
            salePriceCents: product.salePriceCents,
            stock: product.stock,
            categoryId: product.categoryId,
            weightGrams: product.weightGrams,
            imageUrl: product.images[0]?.url ?? "",
          }}
        />
      </div>
    </div>
  );
}
