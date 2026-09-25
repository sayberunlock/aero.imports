"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { FavoritesProvider } from "@/lib/favorites-context";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <FavoritesProvider>
        <CartProvider>{children}</CartProvider>
      </FavoritesProvider>
    </SessionProvider>
  );
}
