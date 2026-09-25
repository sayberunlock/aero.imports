"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { AutoPlayVideo } from "@/components/ui/AutoPlayVideo";

type VideoHighlight = {
  title: string;
  href: string;
  videoSrc: string;
  posterSrc: string;
};

const highlights: VideoHighlight[] = [
  {
    title: "Câmeras e microfones",
    href: "/cameras",
    videoSrc: "/videos/home/cameras-microfones.mp4",
    posterSrc: "/videos/home/cameras-microfones-poster.webp",
  },
  {
    title: "Estabilizadores",
    href: "/estabilizadores",
    videoSrc: "/videos/home/estabilizadores.mp4",
    posterSrc: "/videos/home/estabilizadores-poster.webp",
  },
  {
    title: "Novidade: Osmo Mobile 8 Pro",
    href: "/estabilizadores",
    videoSrc: "/videos/home/osmo-mobile-8-pro.mp4",
    posterSrc: "/videos/home/osmo-mobile-8-pro-poster.webp",
  },
  {
    title: "Novidades DJI",
    href: "/produtos",
    videoSrc: "/videos/home/novidades.mp4",
    posterSrc: "/videos/home/novidades-poster.webp",
  },
];

/**
 * Cards com vídeo em loop mudo. Os vídeos tocam sozinhos, também no
 * celular: cada um só toca enquanto está visível na tela e pausa ao sair
 * (AutoPlayVideo cuida disso), então só baixa o que o cliente rolar até
 * ver — não carrega os 4 de uma vez.
 */
function VideoCard({ item, index }: { item: VideoHighlight; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={item.href}
        className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-ink"
      >
        {/* Poster sempre presente: aparece por trás do vídeo até ele começar a tocar */}
        <Image
          src={item.posterSrc}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <AutoPlayVideo
          className="absolute inset-0 h-full w-full object-cover"
          src={item.videoSrc}
          poster={item.posterSrc}
          preload="none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent transition-opacity group-hover:from-ink/90" />
        <span className="absolute bottom-0 left-0 p-5 font-display text-base font-medium text-cloud sm:text-lg">
          {item.title}
        </span>
      </Link>
    </motion.div>
  );
}

export function VideoShowcase() {
  return (
    <section className="mx-auto max-w-content px-6 py-16 lg:px-10 lg:py-24">
      <Reveal>
        <p className="eyebrow-mono text-signal">Em destaque</p>
        <h2 className="mt-3 font-display text-display-md font-medium text-ink">
          Veja de perto os equipamentos DJI
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {highlights.map((item, i) => (
          <VideoCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
