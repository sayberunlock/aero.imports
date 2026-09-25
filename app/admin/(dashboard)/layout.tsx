"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  Video,
  Newspaper,
  FileText,
  UsersRound,
  MessageSquare,
  Search,
  Settings,
  ShieldAlert,
  DatabaseBackup,
  LogOut,
  Menu,
  X,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminOnboarding, type OnboardingSection } from "@/components/admin/AdminOnboarding";

const sections: OnboardingSection[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Visão geral rápida da loja: pedidos do dia, produtos ativos, clientes e mensagens.",
  },
  {
    href: "/admin/produtos",
    label: "Produtos",
    icon: Package,
    description: "Cadastra, edita e organiza os produtos da loja: fotos, preço, estoque e ficha técnica.",
  },
  {
    href: "/admin/categorias",
    label: "Categorias",
    icon: FolderTree,
    description: "Organiza os produtos por categoria (Drones, Câmeras, Estabilizadores...) usadas nos menus e filtros do site.",
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos",
    icon: ShoppingCart,
    description: "Acompanha os pedidos feitos pelos clientes.",
  },
  {
    href: "/admin/clientes",
    label: "Clientes",
    icon: Users,
    description: "Lista de clientes cadastrados na loja.",
  },
  {
    href: "/admin/cupons",
    label: "Cupons",
    icon: Tag,
    description: "Cria códigos de desconto para promoções.",
  },
  {
    href: "/admin/banners",
    label: "Banners",
    icon: ImageIcon,
    description: "Controla as imagens de destaque que aparecem no site.",
  },
  {
    href: "/admin/videos",
    label: "Vídeos",
    icon: Video,
    description: "Gerencia os vídeos usados no site, como o vídeo de fundo da página inicial.",
  },
  {
    href: "/admin/novidades",
    label: "Novidades",
    icon: Newspaper,
    description: "Publica avisos e novidades que aparecem na aba \"Novidades\" do site.",
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
    description: "Escreve e publica posts do blog da loja.",
  },
  {
    href: "/admin/paginas",
    label: "Páginas",
    icon: FileText,
    description: "Edita o texto de páginas institucionais: Empresa, FAQ, Garantia, Termos de Uso, Privacidade.",
  },
  {
    href: "/admin/equipe",
    label: "Equipe",
    icon: UsersRound,
    description: "Gerencia a equipe exibida na página \"Empresa\" do site.",
  },
  {
    href: "/admin/mensagens",
    label: "Mensagens",
    icon: MessageSquare,
    description: "Mensagens recebidas pelo site, como pelo formulário de contato.",
  },
  {
    href: "/admin/seo",
    label: "SEO",
    icon: Search,
    description: "Configurações que ajudam o site a aparecer melhor no Google (título, descrição etc.).",
  },
  {
    href: "/admin/usuarios",
    label: "Usuários",
    icon: ShieldAlert,
    description: "Gerencia quem tem acesso ao painel admin — cria novos logins pra sua equipe.",
  },
  {
    href: "/admin/backup",
    label: "Backup",
    icon: DatabaseBackup,
    description: "Faz backup dos dados da loja.",
  },
  {
    href: "/admin/configuracoes",
    label: "Configurações",
    icon: Settings,
    description: "Dados gerais da loja: nome, WhatsApp, e-mail e endereço.",
  },
];

const ONBOARDING_KEY = "aero-admin-onboarding-seen";

/**
 * Bug de mobile corrigido nesta sessão: a sidebar antes usava
 * `hidden ... lg:flex`, ou seja, abaixo de 1024px (inclusive em 768px) o
 * painel ficava sem NENHUMA navegação visível — o usuário não conseguia
 * sair da tela em que estava. Agora, abaixo de `lg`, uma barra superior
 * com botão de menu abre um drawer com a mesma navegação.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const alreadySeen = window.localStorage.getItem(ONBOARDING_KEY);
    if (!alreadySeen) {
      setShowOnboarding(true);
    }
  }, []);

  function closeOnboarding() {
    window.localStorage.setItem(ONBOARDING_KEY, "1");
    setShowOnboarding(false);
  }

  return (
    <div className="flex min-h-screen bg-fog">
      {/* Barra superior mobile/tablet (abaixo de lg) */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <p className="font-display text-base font-medium text-cloud">
          AERO<span className="text-signal">IMPORTS</span>
        </p>
        <button
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center text-cloud"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Overlay para fechar o drawer ao tocar fora dele */}
      {menuOpen && (
        <button
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-ink/60 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex-col overflow-y-auto bg-ink px-4 py-6 transition-transform duration-300 ease-aero lg:static lg:flex lg:translate-x-0",
          menuOpen ? "flex translate-x-0 pt-20" : "hidden -translate-x-full"
        )}
      >
        <p className="mb-8 hidden px-2 font-display text-lg font-medium text-cloud lg:block">
          AERO<span className="text-signal">IMPORTS</span>
        </p>
        <nav className="flex-1 space-y-0.5 overflow-y-auto">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-cloud/80 transition-colors hover:bg-white/5 hover:text-cloud"
            >
              <s.icon size={17} strokeWidth={1.6} />
              {s.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setShowOnboarding(true)}
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-steel hover:bg-white/5 hover:text-cloud"
        >
          <HelpCircle size={17} strokeWidth={1.6} />
          Ajuda
        </button>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-steel hover:bg-white/5 hover:text-cloud"
        >
          <LogOut size={17} strokeWidth={1.6} />
          Sair
        </Link>
      </aside>

      <main className="flex-1 p-6 pt-20 lg:p-10 lg:pt-10">{children}</main>

      <AdminOnboarding open={showOnboarding} onClose={closeOnboarding} sections={sections} />
    </div>
  );
}
