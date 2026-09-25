import type { Metadata } from "next";
import { ProductCard } from "@/components/produto/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { getOnSaleProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Promoções",
  description: "Ofertas e descontos em drones, câmeras e estabilizadores DJI originais na Aero Imports.",
};

export const dynamic = "force-dynamic";

export default async function PromocoesPage() {
  const products = await getOnSaleProducts();

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <Reveal>
        <p className="eyebrow-mono text-signal">Ofertas</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">Promoções</h1>
        <p className="mt-2 text-sm text-steel">
          {products.length} produto{products.length === 1 ? "" : "s"} em promoção agora.
        </p>
      </Reveal>

      {products.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-steel-light bg-fog/60 px-6 py-16 text-center text-sm text-steel">
          Nenhuma promoção ativa no momento. Volte em breve para novas ofertas.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
