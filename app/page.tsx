import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { VideoShowcase } from "@/components/home/VideoShowcase";
import { Differentiators } from "@/components/home/Differentiators";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { FlightTrace } from "@/components/ui/FlightTrace";
import { Reveal } from "@/components/ui/Reveal";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Loja Autorizada DJI — Drones, Câmeras e Estabilizadores Profissionais",
  description:
    "Compre drones DJI, câmeras, estabilizadores, microfones e acessórios originais com nota fiscal e garantia. Frete para todo o Brasil.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Vídeo do hero cadastrado no painel (/admin/videos) substitui
  // automaticamente o vídeo estático assim que estiver ativo.
  const heroVideo = await db.siteVideo
    .findFirst({ where: { placement: "home-hero", active: true }, orderBy: { createdAt: "desc" } })
    .catch(() => null);

  return (
    <>
      <Hero videoUrl={heroVideo?.url} />

      <FlightTrace labelLeft="ALT · 0M" labelRight="AERO IMPORTS · BR" />

      <CategoryGrid />

      <VideoShowcase />

      <FeaturedProducts />

      <ProductShowcase />

      <Differentiators />

      <section className="mx-auto max-w-content px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <p className="eyebrow-mono text-signal">Assistência Técnica</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-display-md font-medium text-ink">
            Manutenção e suporte técnico especializado para equipamentos DJI.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-steel">
            Da calibração à reposição de peças originais — nossa equipe cuida
            do seu equipamento com a mesma precisão que ele exige em voo.
          </p>
          <Link
            href="/assistencia-tecnica"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-aero px-7 py-3.5 text-sm font-medium text-cloud transition-transform duration-300 ease-aero hover:scale-[1.03]"
          >
            Conhecer a Assistência Técnica
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
