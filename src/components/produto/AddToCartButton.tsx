"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { ProductSummary } from "@/lib/types";

export function AddToCartButton({ product }: { product: ProductSummary }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-aero px-7 py-3.5 text-sm font-medium text-cloud transition-transform duration-300 ease-aero hover:scale-[1.02]"
    >
      {added ? (
        <>
          <Check size={16} />
          Adicionado ao carrinho
        </>
      ) : (
        "Adicionar ao carrinho"
      )}
    </button>
  );
}
