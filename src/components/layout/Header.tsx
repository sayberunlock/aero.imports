"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { navLinks } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

/**
 * Rotas cuja primeira dobra tem fundo escuro (Hero em tela cheia).
 * Nessas rotas, antes do scroll, o menu usa texto claro sobre o hero.
 * Em qualquer outra rota (fundo claro), o texto é sempre escuro.
 * Isso corrige o bug em que "AERO" (texto branco) ficava invisível
 * em páginas com fundo branco, deixando só "IMPORTS" visível.
 */
const DARK_HERO_ROUTES = ["/"];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const overDarkHero = DARK_HERO_ROUTES.includes(pathname ?? "") && !scrolled;
  const textTone = overDarkHero ? "text-cloud" : "text-ink";
  const textToneMuted = overDarkHero ? "text-cloud/85" : "text-ink/75";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-aero",
        overDarkHero ? "bg-transparent" : "bg-cloud/85 backdrop-blur-md shadow-card"
      )}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/"
          className={cn("shrink-0 font-display text-xl font-medium tracking-tight transition-colors", textTone)}
          aria-label="Aero Imports — página inicial"
        >
          AERO<span className="text-signal">IMPORTS</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("text-sm font-medium transition-colors hover:text-signal", textToneMuted)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={cn("flex items-center gap-4", textToneMuted)}>
          <button
            aria-label="Buscar produtos"
            className="transition-colors hover:text-signal"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.6} />
          </button>
          <Link href="/favoritos" aria-label="Favoritos" className="hidden transition-colors hover:text-signal sm:block">
            <Heart size={20} strokeWidth={1.6} />
          </Link>
          <Link href="/conta" aria-label="Minha conta" className="hidden transition-colors hover:text-signal sm:block">
            <User size={20} strokeWidth={1.6} />
          </Link>
          <Link href="/carrinho" aria-label="Carrinho de compras" className="transition-colors hover:text-signal">
            <ShoppingBag size={20} strokeWidth={1.6} />
          </Link>
          <button
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className={cn("lg:hidden", textTone)}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-cloud/95 backdrop-blur-md lg:hidden"
            aria-label="Navegação mobile"
          >
            <div className="flex flex-col gap-1 px-6 pb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-ink/10 py-3 text-ink/90"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
