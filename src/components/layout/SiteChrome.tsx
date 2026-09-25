"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";

type Props = {
  children: ReactNode;
  footer: ReactNode;
  whatsapp: ReactNode;
  intro: ReactNode;
};

/**
 * Antes, o Header/Footer/WhatsAppButton/IntroOverlay do site público eram
 * renderizados direto no layout raiz (app/layout.tsx), o que significava
 * que apareciam em CIMA de qualquer rota, inclusive /admin. Como o Header
 * público é "fixed" no topo com z-index alto, ele cobria o topo do painel
 * admin (título "Dashboard" cortado, sidebar cortada).
 *
 * Este componente decide, pelo caminho da URL, se está numa rota /admin —
 * nesse caso, o painel admin já tem seu próprio cabeçalho/menu lateral
 * (ver app/admin/(dashboard)/layout.tsx e app/admin/login), então aqui a
 * gente não renderiza nada do site público por cima.
 */
export function SiteChrome({ children, footer, whatsapp, intro }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {intro}
      <Header />
      <main id="conteudo-principal">{children}</main>
      {footer}
      {whatsapp}
    </>
  );
}
