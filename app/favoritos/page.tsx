"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/produto/ProductCard";
import { useFavorites } from "@/lib/favorites-context";

export default function FavoritosPage() {
  const { favorites } = useFavorites();

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <header className="mb-10">
        <p className="eyebrow-mono text-signal">Sua conta</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">Favoritos</h1>
        <p className="mt-2 text-sm text-steel">
          {favorites.length} produto{favorites.length === 1 ? "" : "s"} salvo{favorites.length === 1 ? "" : "s"}.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-steel-light bg-fog/60 px-6 py-20 text-center">
          <Heart size={28} className="text-steel" />
          <p className="text-sm text-steel">Você ainda não adicionou nenhum produto aos favoritos.</p>
          <Link href="/produtos" className="text-sm font-medium text-signal hover:underline">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {favorites.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
