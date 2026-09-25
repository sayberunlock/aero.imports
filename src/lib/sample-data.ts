import type { ProductSummary } from "@/lib/types";

/**
 * Dados de exemplo para desenvolvimento/preview de layout.
 * Em produção, estes dados vêm do PostgreSQL via Prisma
 * (ver prisma/schema.prisma e src/lib/db.ts) e são gerenciados
 * pelo painel /admin/produtos. Nenhum destes preços é real —
 * atualizar antes de publicar.
 */
export const sampleProducts: ProductSummary[] = [
  {
    id: "1",
    slug: "dji-mavic-3-pro",
    name: "DJI Mavic 3 Pro",
    brand: "DJI",
    priceCents: 1899900,
    salePriceCents: 1749900,
    imageUrl: "/images/products/placeholder-drone.svg",
    badge: "Promoção",
    categorySlug: "drones",
  },
  {
    id: "2",
    slug: "dji-air-3",
    name: "DJI Air 3",
    brand: "DJI",
    priceCents: 999900,
    imageUrl: "/images/products/placeholder-drone.svg",
    badge: "Novo",
    categorySlug: "drones",
  },
  {
    id: "3",
    slug: "dji-rs-4-mini",
    name: "DJI RS 4 Mini",
    brand: "DJI",
    priceCents: 349900,
    imageUrl: "/images/products/placeholder-gimbal.svg",
    badge: null,
    categorySlug: "estabilizadores",
  },
  {
    id: "4",
    slug: "dji-osmo-pocket-3",
    name: "DJI Osmo Pocket 3",
    brand: "DJI",
    priceCents: 449900,
    imageUrl: "/images/products/placeholder-camera.svg",
    badge: "Novo",
    categorySlug: "cameras",
  },
  {
    id: "5",
    slug: "dji-mic-2",
    name: "DJI Mic 2 (Dupla)",
    brand: "DJI",
    priceCents: 279900,
    imageUrl: "/images/products/placeholder-mic.svg",
    badge: null,
    categorySlug: "microfones",
  },
  {
    id: "6",
    slug: "dji-neo",
    name: "DJI Neo",
    brand: "DJI",
    priceCents: 219900,
    salePriceCents: 189900,
    imageUrl: "/images/products/placeholder-drone.svg",
    badge: "Promoção",
    categorySlug: "drones",
  },
  {
    id: "7",
    slug: "dji-goggles-3",
    name: "DJI Goggles 3",
    brand: "DJI",
    priceCents: 599900,
    imageUrl: "/images/products/placeholder-fpv.svg",
    badge: null,
    categorySlug: "acessorios",
  },
  {
    id: "8",
    slug: "dji-rs-3-pro",
    name: "DJI RS 3 Pro",
    brand: "DJI",
    priceCents: 699900,
    imageUrl: "/images/products/placeholder-gimbal.svg",
    badge: null,
    categorySlug: "estabilizadores",
  },
];
