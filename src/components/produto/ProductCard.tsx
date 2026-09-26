"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { formatBRL, installmentLabel } from "@/lib/utils";
import { useFavorites } from "@/lib/favorites-context";
import type { ProductSummary } from "@/lib/types";

export function ProductCard({ product }: { product: ProductSummary }) {
  const hasDiscount = product.salePriceCents != null && product.salePriceCents < product.priceCents;
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.slug);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-cloud transition-shadow duration-300 hover:shadow-elevate"
    >
      <button
        aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        aria-pressed={favorited}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product);
        }}
        className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-cloud/90 backdrop-blur transition-colors ${
          favorited ? "text-signal" : "text-ink/70 hover:text-signal"
        }`}
      >
        <Heart size={17} strokeWidth={1.6} fill={favorited ? "currentColor" : "none"} />
      </button>

      {product.badge && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-ink px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-cloud">
          {product.badge}
        </span>
      )}

      <Link href={`/produtos/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden bg-fog">
          <motion.div
            className="h-full w-full"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-1"
              loading="lazy"
            />
          </motion.div>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-5">
          <p className="eyebrow-mono text-steel">{product.brand}</p>
          <h3 className="font-body text-sm font-medium text-ink line-clamp-2">{product.name}</h3>

          <div className="mt-2">
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-steel line-through">{formatBRL(product.priceCents)}</span>
                <span className="font-display text-lg font-medium text-aero">
                  {formatBRL(product.salePriceCents!)}
                </span>
              </div>
            ) : (
              <span className="font-display text-lg font-medium text-aero">
                {formatBRL(product.priceCents)}
              </span>
            )}
            <p className="mt-0.5 text-xs text-steel">
              {installmentLabel(
                hasDiscount ? product.salePriceCents! : product.priceCents,
                12,
                product.installmentsWithInterest
              )}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
