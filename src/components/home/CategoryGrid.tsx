"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { mainCategories } from "@/lib/site-config";

const categoryImages: Record<string, string> = {
  drones: "/images/categories/drones.svg",
  cameras: "/images/categories/cameras.svg",
  estabilizadores: "/images/categories/estabilizadores.svg",
  microfones: "/images/categories/microfones.svg",
  celulares: "/images/categories/celulares.svg",
  acessorios: "/images/categories/acessorios.svg",
};

export function CategoryGrid() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Parallax leve (≤ 40px, conforme docs/DESIGN_SYSTEM.md) nas imagens dos cards.
  const imageY = useTransform(scrollYProgress, [0, 1], [-16, 16]);

  return (
    <section ref={ref} className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <p className="eyebrow-mono text-signal">Catálogo</p>
        <h2 className="mt-3 font-display text-display-md font-medium text-ink">
          Explore por categoria
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {mainCategories.map((category, i) => (
          <Reveal key={category.slug} delay={i * 0.05}>
            <Link
              href={`/${category.slug}`}
              className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-fog"
            >
              <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
                <Image
                  src={categoryImages[category.slug] ?? "/images/categories/placeholder.svg"}
                  alt={category.label}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 ease-aero group-hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <span className="relative z-10 p-4 font-display text-sm font-medium text-cloud">
                {category.label}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
