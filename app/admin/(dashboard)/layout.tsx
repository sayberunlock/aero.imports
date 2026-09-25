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
} from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
  { href: "/admin/categorias", label: "Categorias", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/cupons", label: "Cupons", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/videos", label: "Vídeos", icon: Video },
  { href: "/admin/novidades", label: "Novidades", icon: Newspaper },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/paginas", label: "Páginas", icon: FileText },
  { href: "/admin/equipe", label: "Equipe", icon: UsersRound },
  { href: "/admin/mensagens", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/usuarios", label: "Usuários", icon: ShieldAlert },
  { href: "/admin/backup", label: "Backup", icon: DatabaseBackup },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
        <Link
          href="/api/auth/signout"
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-steel hover:bg-white/5 hover:text-cloud"
        >
          <LogOut size={17} strokeWidth={1.6} />
          Sair
        </Link>
      </aside>

      <main className="flex-1 p-6 pt-20 lg:p-10 lg:pt-10">{children}</main>
    </div>
  );
}
