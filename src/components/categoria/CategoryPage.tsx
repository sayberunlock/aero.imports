import { ProductCard } from "@/components/produto/ProductCard";
import { getProductsByCategory } from "@/lib/products";

export async function CategoryPage({ slug, label }: { slug: string; label: string }) {
  const products = await getProductsByCategory(slug);

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <header className="mb-10">
        <p className="eyebrow-mono text-signal">Catálogo</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">{label}</h1>
        <p className="mt-2 text-sm text-steel">
          {products.length} produto{products.length === 1 ? "" : "s"} nesta categoria.
        </p>
      </header>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed border-steel-light bg-fog/60 px-6 py-16 text-center text-sm text-steel">
          Ainda não há produtos publicados em {label.toLowerCase()}. Volte em breve.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
