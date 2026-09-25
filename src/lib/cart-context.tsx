"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ProductSummary } from "@/lib/types";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string;
  unitPriceCents: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (product: ProductSummary, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  subtotalCents: number;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "aero-imports:cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carrega o carrinho salvo no navegador (persistência entre sessões).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponível (modo privado, etc.) — segue com carrinho vazio.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignora falha de escrita (ex.: quota excedida).
    }
  }, [items, hydrated]);

  function addItem(product: ProductSummary, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          imageUrl: product.imageUrl,
          unitPriceCents: product.salePriceCents ?? product.priceCents,
          quantity,
        },
      ];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function updateQuantity(slug: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, quantity } : i)));
  }

  function clear() {
    setItems([]);
  }

  const subtotalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
    [items]
  );
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, subtotalCents, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa ser usado dentro de <CartProvider>");
  return ctx;
}
