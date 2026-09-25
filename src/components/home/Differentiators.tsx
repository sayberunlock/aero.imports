"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, FileCheck2, Headset, Truck, BadgeCheck, LockKeyhole } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  { icon: BadgeCheck, title: "Loja Autorizada DJI", text: "Revenda oficial, com produtos homologados." },
  { icon: ShieldCheck, title: "Produtos Originais", text: "Zero paralelos. Procedência garantida em cada item." },
  { icon: FileCheck2, title: "Nota Fiscal", text: "Todas as compras emitidas com NF-e." },
  { icon: LockKeyhole, title: "Compra Segura", text: "Ambiente criptografado e pagamento protegido." },
  { icon: Headset, title: "Suporte Especializado", text: "Atendimento humano, técnico e sem robôs." },
  { icon: Truck, title: "Frete para Todo o Brasil", text: "Envio rastreado a qualquer estado do país." },
];

export function Differentiators() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Parallax leve (≤ 40px, conforme docs/DESIGN_SYSTEM.md) num brilho decorativo de fundo.
  const glowY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-16 text-cloud lg:py-24">
      <motion.div
        style={{ y: glowY }}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-signal/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-content px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow-mono text-signal">Por que a Aero Imports</p>
          <h2 className="mt-3 max-w-2xl font-display text-display-md font-medium">
            Confiança de quem opera equipamento profissional.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="flex gap-4">
                <item.icon className="mt-1 shrink-0 text-signal" size={26} strokeWidth={1.5} />
                <div>
                  <h3 className="font-body text-base font-semibold text-cloud">{item.title}</h3>
                  <p className="mt-1 text-sm text-steel-light text-steel">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
