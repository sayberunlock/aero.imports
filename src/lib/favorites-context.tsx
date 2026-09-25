"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ProductSummary } from "@/lib/types";

type FavoritesContextValue = {
  favorites: ProductSummary[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (product: ProductSummary) => void;
  removeFavorite: (slug: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = "aero-imports:favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<ProductSummary[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // localStorage indisponível — segue com lista vazia.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignora falha de escrita.
    }
  }, [favorites, hydrated]);

  function isFavorite(slug: string) {
    return favorites.some((f) => f.slug === slug);
  }

  function toggleFavorite(product: ProductSummary) {
    setFavorites((prev) =>
      prev.some((f) => f.slug === product.slug)
        ? prev.filter((f) => f.slug !== product.slug)
        : [...prev, product]
    );
  }

  function removeFavorite(slug: string) {
    setFavorites((prev) => prev.filter((f) => f.slug !== slug));
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites precisa ser usado dentro de <FavoritesProvider>");
  return ctx;
}
