import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductFilters } from "@/components/produto/ProductFilters";
import { getAllProducts } from "@/lib/products";
import { mainCategories } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Catálogo de Produtos DJI",
  description:
    "Drones, câmeras, estabilizadores, microfones e acessórios DJI originais. Filtre por categoria, marca e faixa de preço.",
};

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <header className="mb-10">
        <p className="eyebrow-mono text-signal">Catálogo</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">
          Todos os produtos
        </h1>
      </header>

      <Suspense fallback={null}>
        <ProductFilters products={products} categories={mainCategories} />
      </Suspense>
    </div>
  );
}
