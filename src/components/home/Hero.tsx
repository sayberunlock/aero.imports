"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { AutoPlayVideo } from "@/components/ui/AutoPlayVideo";

/**
 * Hero de tela cheia. O poster funciona como LCP rápido enquanto o vídeo
 * não chega — o arquivo definitivo será enviado pelo proprietário do
 * site via painel admin (/admin/videos).
 *
 * Sem nenhum vídeo cadastrado no banco (instalação nova), o hero usa um
 * dos vídeos reais que já vêm no projeto, então sempre mostra vídeo.
 *
 * O vídeo toca sozinho, inclusive no celular, sem o cliente precisar
 * apertar nada: toda a lógica de autoplay fica em AutoPlayVideo (mudo +
 * várias tentativas de play + toque real como último recurso).
 */
const DEFAULT_HERO_VIDEO = "/videos/home/cameras-microfones.mp4";
export function Hero({ videoUrl }: { videoUrl?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <AutoPlayVideo
          className="h-full w-full object-cover opacity-70"
          src={videoUrl ?? DEFAULT_HERO_VIDEO}
          poster="/images/hero-poster.svg"
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-content px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="eyebrow-mono mb-6 text-signal"
        >
          LOJA AUTORIZADA DJI · BRASIL
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-display-xl font-medium text-cloud"
        >
          Precisão que
          <br />
          <span className="text-signal">voa alto.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mx-auto mt-6 max-w-xl text-balance text-base text-cloud/80 sm:text-lg"
        >
          Drones, câmeras, estabilizadores e acessórios DJI originais — com
          nota fiscal, garantia e o suporte técnico que sua operação exige.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/produtos"
            className="group flex items-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-medium text-cloud transition-transform duration-300 ease-aero hover:scale-[1.03]"
          >
            Conheça os Produtos
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-cloud transition-colors duration-300 hover:border-signal hover:text-signal"
          >
            <MessageCircle size={16} />
            Fale no WhatsApp
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-steel-light"
      >
        <span className="eyebrow-mono">ROLE PARA EXPLORAR</span>
      </motion.div>
    </section>
  );
}
