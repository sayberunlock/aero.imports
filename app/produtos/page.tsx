import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ShieldCheck, Truck, MessageCircle } from "lucide-react";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { formatBRL, installmentLabel } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { ProductCard } from "@/components/produto/ProductCard";
import { AddToCartButton } from "@/components/produto/AddToCartButton";
import { BuyNowButton } from "@/components/produto/BuyNowButton";
import { Reveal } from "@/components/ui/Reveal";

type Props = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `Compre ${product.name} original, com nota fiscal e garantia, na Aero Imports — loja autorizada DJI.`,
    openGraph: {
      title: product.name,
      images: [{ url: product.imageUrl }],
    },
    alternates: { canonical: `/produtos/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const hasDiscount = product.salePriceCents != null && product.salePriceCents < product.priceCents;
  const finalPrice = hasDiscount ? product.salePriceCents! : product.priceCents;

  const allProducts = await getAllProducts();
  const related = allProducts
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    image: `${siteConfig.url}${product.imageUrl}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: (finalPrice / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/produtos/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-fog">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-1"
            priority
          />
        </div>

        <div>
          <p className="eyebrow-mono text-signal">{product.brand}</p>
          <h1 className="mt-2 font-display text-display-md font-medium text-ink">{product.name}</h1>

          <div className="mt-6">
            {hasDiscount && (
              <p className="text-sm text-steel line-through">{formatBRL(product.priceCents)}</p>
            )}
            <p className="font-display text-3xl font-medium text-aero">{formatBRL(finalPrice)}</p>
            <p className="mt-1 text-sm text-steel">{installmentLabel(finalPrice)}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BuyNowButton productName={product.name} unitPriceCents={finalPrice} whatsappNumber={siteConfig.whatsapp} />
            <AddToCartButton product={product} />
          </div>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
              `Olá! Tenho interesse no produto ${product.name}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-steel hover:text-signal sm:justify-start"
          >
            <MessageCircle size={15} />
            Prefere tirar uma dúvida antes? Fale no WhatsApp
          </a>

          <div className="mt-8 space-y-3 border-t border-fog pt-6 text-sm text-steel">
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-signal" /> Produto original, com nota fiscal e garantia.
            </p>
            <p className="flex items-center gap-2">
              <Truck size={16} className="text-signal" /> Envio para todo o Brasil.
            </p>
          </div>

          <details className="mt-8 border-t border-fog pt-6" open>
            <summary className="cursor-pointer text-sm font-medium text-ink">Descrição completa</summary>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-steel">
              {product.description}
            </p>
          </details>

          {product.specs.length > 0 && (
            <div className="mt-6 border-t border-fog pt-6">
              <p className="text-sm font-medium text-ink">Ficha técnica</p>
              <dl className="mt-3 space-y-1.5 text-sm">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between gap-4 text-steel">
                    <dt>{spec.label}</dt>
                    <dd className="text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {product.gallery.length > 1 && (
        <section className="mt-16">
          <p className="eyebrow-mono text-signal">Galeria</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {product.gallery.map((url, i) => (
              <div key={url + i} className="relative aspect-square overflow-hidden rounded-xl bg-fog">
                <Image src={url} alt={`${product.name} — imagem ${i + 1}`} fill className="object-contain p-1" />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16 border-t border-fog pt-10">
        <p className="eyebrow-mono text-signal">Avaliações</p>
        <h2 className="mt-2 font-display text-xl font-medium text-ink">
          {product.reviews.length > 0
            ? `${product.reviews.length} avaliação${product.reviews.length === 1 ? "" : "ões"}`
            : "Ainda sem avaliações"}
        </h2>

        {product.reviews.length === 0 ? (
          <p className="mt-3 text-sm text-steel">
            Este produto ainda não recebeu avaliações. Seja o primeiro a avaliar após a compra.
          </p>
        ) : (
          <ul className="mt-6 space-y-6">
            {product.reviews.map((review, i) => (
              <li key={i} className="border-b border-fog pb-6 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="flex text-signal">
                    {"★".repeat(review.rating)}
                    <span className="text-fog">{"★".repeat(5 - review.rating)}</span>
                  </div>
                  <span className="text-sm font-medium text-ink">{review.authorName}</span>
                </div>
                {review.comment && <p className="mt-2 text-sm text-steel">{review.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <p className="eyebrow-mono text-signal">Você também pode gostar</p>
            <h2 className="mt-3 font-display text-display-md font-medium text-ink">Produtos relacionados</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
