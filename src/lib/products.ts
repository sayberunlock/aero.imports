import { db } from "@/lib/db";
import { sampleProducts } from "@/lib/sample-data";
import type { ProductDetail, ProductSummary } from "@/lib/types";

/**
 * Camada única de acesso a produtos para as páginas públicas da loja.
 *
 * Antes desta camada, o catálogo público (app/produtos, categorias, home)
 * lia direto de `sample-data.ts` (dados fixos de exemplo), enquanto o
 * painel administrativo (/admin/produtos) gerenciava produtos reais no
 * Postgres via Prisma — dois catálogos completamente desconectados: um
 * produto cadastrado no admin nunca aparecia na loja.
 *
 * Esta camada consulta o banco real primeiro. Se a consulta falhar (banco
 * ainda não provisionado neste ambiente) ou não houver produtos
 * cadastrados ainda, ela usa os dados de exemplo como fallback — apenas
 * para que a loja não fique vazia durante o desenvolvimento inicial.
 * Assim que houver produtos reais no banco, eles substituem o exemplo
 * automaticamente, sem precisar tocar em código.
 */

function toBadge(p: { isNew: boolean; isOnSale: boolean; status: string }): ProductSummary["badge"] {
  if (p.status === "ESGOTADO") return "Esgotado";
  if (p.status === "SOB_ENCOMENDA") return "Sob encomenda";
  if (p.isOnSale) return "Promoção";
  if (p.isNew) return "Novo";
  return null;
}

function dbToSummary(p: any): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    priceCents: p.priceCents,
    salePriceCents: p.salePriceCents,
    imageUrl: p.images?.[0]?.url ?? "/images/products/placeholder-drone.svg",
    badge: toBadge(p),
    categorySlug: p.category?.slug ?? "",
    installmentsWithInterest: Boolean(p.installmentsWithInterest),
  };
}

function dbToDetail(p: any): ProductDetail {
  return {
    ...dbToSummary(p),
    description: p.description,
    specs: (p.specs ?? []).map((s: any) => ({ label: s.label, value: s.value })),
    gallery: (p.images ?? []).map((img: any) => img.url),
    videoUrl: p.videos?.[0]?.url ?? null,
    weightGrams: p.weightGrams,
    model: p.model,
    tags: (p.tags ?? []).map((t: any) => t.tag?.name).filter(Boolean),
    stock: p.stock,
    relatedSlugs: (p.relatedFrom ?? []).map((r: any) => r.related?.slug).filter(Boolean),
    reviews: (p.reviews ?? []).map((r: any) => ({
      authorName: r.user?.name ?? "Cliente Aero Imports",
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    })),
  };
}

async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    // Banco indisponível neste ambiente (sem conexão Postgres) — cai no
    // fallback de dados de exemplo em vez de derrubar a página.
    return fallback;
  }
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  const dbProducts = await safeQuery(
    () =>
      db.product.findMany({
        where: { isArchived: false },
        orderBy: { createdAt: "desc" },
        include: { category: true, images: { orderBy: { position: "asc" } } },
      }),
    []
  );

  if (dbProducts.length > 0) return dbProducts.map(dbToSummary);
  return sampleProducts;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | undefined> {
  const dbProduct = await safeQuery(
    () =>
      db.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: { orderBy: { position: "asc" } },
          videos: true,
          specs: { orderBy: { position: "asc" } },
          tags: { include: { tag: true } },
          relatedFrom: { include: { related: true } },
          reviews: { where: { approved: true }, include: { user: true }, orderBy: { createdAt: "desc" } },
        },
      }),
    null
  );

  if (dbProduct) return dbToDetail(dbProduct);

  const sample = sampleProducts.find((p) => p.slug === slug);
  if (!sample) return undefined;
  return {
    ...sample,
    description:
      "Ficha técnica completa, galeria de imagens e vídeo deste produto serão exibidos aqui a partir dos dados cadastrados no painel administrativo (/admin/produtos).",
    specs: [],
    gallery: [sample.imageUrl],
    videoUrl: null,
    weightGrams: null,
    model: sample.brand,
    tags: [],
    stock: 10,
    relatedSlugs: [],
    reviews: [],
  };
}

export async function getProductsByCategory(categorySlug: string): Promise<ProductSummary[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
  const dbFeatured = await safeQuery(
    () =>
      db.product.findMany({
        where: { isFeatured: true, isArchived: false },
        orderBy: { createdAt: "desc" },
        take: 8,
        include: { category: true, images: { orderBy: { position: "asc" } } },
      }),
    []
  );
  if (dbFeatured.length > 0) return dbFeatured.map(dbToSummary);

  const all = await getAllProducts();
  return all.slice(0, 8);
}

export async function getNewProducts(): Promise<ProductSummary[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.badge === "Novo");
}

export async function getOnSaleProducts(): Promise<ProductSummary[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.badge === "Promoção" || (p.salePriceCents != null && p.salePriceCents < p.priceCents));
}

/**
 * Remove acentos para permitir busca "arroz sem sal" (ex.: usuário digita
 * "camera" e encontra "câmera").
 */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Busca por nome ou marca do produto. Usada pela lupa no cabeçalho e pelo
 * campo de busca da página /produtos (parâmetro ?busca=).
 */
export async function searchProducts(query: string): Promise<ProductSummary[]> {
  const q = normalize(query);
  if (!q) return [];

  const all = await getAllProducts();
  return all.filter((p) => normalize(p.name).includes(q) || normalize(p.brand).includes(q));
}
