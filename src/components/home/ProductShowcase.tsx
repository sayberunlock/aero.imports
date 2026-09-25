"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";

const photos = Array.from({ length: 13 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return `/images/vitrine/produto-${num}.webp`;
});

/**
 * Vitrine com fotos reais de equipamentos DJI. Cada card tem parallax leve
 * (mesmo padrão do CategoryGrid — ver docs/DESIGN_SYSTEM.md) e entra com
 * fade + leve deslocamento conforme a seção aparece na tela ao rolar.
 */
export function ProductShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <section ref={ref} className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <p className="eyebrow-mono text-signal">Vitrine</p>
        <h2 className="mt-3 font-display text-display-md font-medium text-ink">
          Equipamentos que fazem parte do nosso dia a dia
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {photos.map((src, i) => (
          <Reveal key={src} delay={(i % 5) * 0.06}>
            <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-fog">
              <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
                <Image
                  src={src}
                  alt="Equipamento DJI disponível na Aero Imports"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 ease-aero group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
