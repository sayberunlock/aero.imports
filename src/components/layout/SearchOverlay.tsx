"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import type { ProductSummary } from "@/lib/types";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Foca o campo assim que o overlay abre, e limpa a busca quando fecha.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
    setQuery("");
    setResults([]);
    setTotal(0);
  }, [open]);

  // Fecha com a tecla Esc.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Busca com debounce de 300ms para não disparar uma requisição a cada tecla.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/produtos/busca?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products ?? []);
        setTotal(data.total ?? 0);
      } catch {
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  function goToAllResults() {
    if (query.trim().length < 2) return;
    router.push(`/produtos?busca=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-0 z-[70] bg-cloud shadow-elevate"
            role="dialog"
            aria-modal="true"
            aria-label="Buscar produtos"
          >
            <div className="mx-auto max-w-content px-6 pt-6 lg:px-10">
              <div className="flex items-center gap-3 border-b border-fog pb-4">
                <Search size={20} strokeWidth={1.6} className="shrink-0 text-steel" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goToAllResults();
                  }}
                  placeholder="Buscar drones, câmeras, estabilizadores…"
                  className="w-full bg-transparent font-display text-lg text-ink outline-none placeholder:text-steel/70"
                />
                {loading && <Loader2 size={18} className="shrink-0 animate-spin text-steel" />}
                <button
                  aria-label="Fechar busca"
                  onClick={onClose}
                  className="shrink-0 text-steel transition-colors hover:text-signal"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto py-4">
                {query.trim().length < 2 ? (
                  <p className="py-8 text-center text-sm text-steel">
                    Digite ao menos 2 letras para buscar no catálogo.
                  </p>
                ) : !loading && results.length === 0 ? (
                  <p className="py-8 text-center text-sm text-steel">
                    Nenhum produto encontrado para “{query}”.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2 pb-4 sm:grid-cols-2">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/produtos/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-fog"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-fog">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="eyebrow-mono text-steel">{product.brand}</p>
                          <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                          <p className="text-sm font-medium text-aero">
                            {formatBRL(product.salePriceCents ?? product.priceCents)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {total > results.length && (
                  <button
                    onClick={goToAllResults}
                    className="mb-4 w-full rounded-full border border-fog py-3 text-sm font-medium text-ink transition-colors hover:border-signal hover:text-signal"
                  >
                    Ver todos os {total} resultados
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
