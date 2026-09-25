"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const SESSION_KEY = "aero-intro-shown";
/** Duração total do overlay antes de desaparecer (ms). Pedido original: 1.5–2s. */
const TOTAL_DURATION_MS = 1800;

/**
 * Intro cinematográfica opcional (traço de telemetria + wordmark) exibida
 * apenas na primeira visita da sessão (`sessionStorage`).
 *
 * Requisitos que este componente respeita:
 * - Nunca atrasa o carregamento real da página: o conteúdo já está
 *   renderizado por baixo, isto é só um overlay decorativo por cima.
 * - Some rápido (≈1.8s) e some de vez — nunca aparece de novo na mesma sessão.
 * - Respeita `prefers-reduced-motion` (não renderiza nada nesse caso).
 * - Se o `sessionStorage` falhar (modo privado, storage bloqueado etc.), o
 *   componente simplesmente não aparece — nunca trava a página por causa disso.
 */
export function IntroOverlay({ siteName }: { siteName: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage indisponível (modo privado etc.) — não bloqueia, só não mostra.
      return;
    }

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), TOTAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-5">
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <motion.circle
                cx="36"
                cy="36"
                r="4"
                fill="#2C7BE0"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              />
              {[
                [36 - 22, 36 - 22],
                [36 + 22, 36 - 22],
                [36 - 22, 36 + 22],
                [36 + 22, 36 + 22],
              ].map(([x, y], i) => (
                <g key={i}>
                  <motion.line
                    x1="36"
                    y1="36"
                    x2={x}
                    y2={y}
                    stroke="#2C7BE0"
                    strokeWidth="1.4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                  />
                  <motion.circle
                    cx={x}
                    cy={y}
                    r="2.6"
                    fill="#EEF1F4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
                  />
                </g>
              ))}
            </svg>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="font-display text-sm font-medium tracking-[0.2em] text-cloud"
            >
              {siteName.toUpperCase()}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
