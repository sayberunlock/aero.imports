export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  priceCents: number;
  salePriceCents?: number | null;
  imageUrl: string;
  badge?: "Novo" | "Promoção" | "Esgotado" | "Sob encomenda" | null;
  categorySlug: string;
  installmentsWithInterest?: boolean;
};

export type ProductDetail = ProductSummary & {
  description: string;
  specs: { label: string; value: string }[];
  gallery: string[];
  videoUrl?: string | null;
  weightGrams?: number | null;
  model: string;
  tags: string[];
  stock: number;
  relatedSlugs: string[];
  reviews: { authorName: string; rating: number; comment: string | null; createdAt: string }[];
};
