import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/produto/ProductCard";
import { getFeaturedProducts } from "@/lib/products";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow-mono text-signal">Selecionados</p>
            <h2 className="mt-3 font-display text-display-md font-medium text-ink">
              Mais procurados
            </h2>
          </div>
          <Link
            href="/produtos"
            className="group flex items-center gap-2 text-sm font-medium text-aero hover:text-signal"
          >
            Ver catálogo completo
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 0.06}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
