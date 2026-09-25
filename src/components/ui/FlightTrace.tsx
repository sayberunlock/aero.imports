"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * FlightTrace — elemento de assinatura da Aero Imports.
 *
 * Uma linha fina que se desenha conforme o usuário rola a página,
 * acompanhada de legendas no estilo de telemetria de voo (altitude,
 * coordenadas). É a referência visual direta ao HUD de um drone DJI —
 * usar no máximo 1–2 vezes por página, nunca como decoração repetida.
 */
export function FlightTrace({
  labelLeft,
  labelRight,
  className,
}: {
  labelLeft?: string;
  labelRight?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={cn("relative flex items-center gap-4 py-8", className)}>
      {labelLeft && (
        <span className="eyebrow-mono whitespace-nowrap text-steel">{labelLeft}</span>
      )}
      <svg className="h-px w-full flex-1" viewBox="0 0 100 1" preserveAspectRatio="none">
        <line
          x1="0"
          y1="0.5"
          x2="100"
          y2="0.5"
          stroke="currentColor"
          strokeWidth="1"
          className="text-fog"
        />
        <motion.line
          x1="0"
          y1="0.5"
          x2="100"
          y2="0.5"
          stroke="currentColor"
          strokeWidth="1.4"
          className="text-signal"
          style={{ pathLength }}
        />
      </svg>
      {labelRight && (
        <span className="eyebrow-mono whitespace-nowrap text-steel">{labelRight}</span>
      )}
    </div>
  );
}
