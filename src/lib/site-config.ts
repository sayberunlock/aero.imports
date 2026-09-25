/**
 * Constantes públicas e seguras para uso em componentes de servidor E de
 * navegador ("use client"). Este arquivo NUNCA deve importar `@/lib/db`
 * (Prisma) — se importar, qualquer componente "use client" que use algo
 * daqui (ex.: CategoryGrid, Header, Hero) arrasta o Prisma inteiro para o
 * bundle do navegador e quebra a build com
 * "Module not found: Can't resolve '.prisma/client/index-browser'".
 *
 * A função que lê configuração do banco (`getSiteConfig`) fica em
 * `@/lib/site-config-server` — só pode ser chamada por componentes de
 * servidor (Server Components), nunca por um componente "use client".
 */

export const siteConfig = {
  name: "Aero Imports",
  description:
    "Loja autorizada DJI no Brasil. Drones profissionais, câmeras, estabilizadores, microfones e acessórios originais, com nota fiscal, garantia e suporte especializado.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "") || "https://www.aeroimports.com.br",
  phone: "+55 44 99137-5357",
  whatsapp: "5544991375357", // Número oficial da Aero Imports (somente números, com DDI+DDD)
  email: "contato@aeroimports.com.br", // TODO: confirmar e-mail oficial
  address: {
    street: "Rua Ipiranga, 574 — Zona 1",
    city: "Cianorte",
    state: "PR",
    zip: "00000-000", // TODO: CEP real ainda não informado
  },
  social: {
    instagram: "https://www.instagram.com/aeroimports55?stkn=ZDNlZDc0MzIxNw==",
  },
  hours: "Seg. a Sex., 9h–18h · Sáb., 9h–13h",
} as const;

export const mainCategories = [
  { slug: "drones", label: "Drones" },
  { slug: "cameras", label: "Câmeras" },
  { slug: "estabilizadores", label: "Estabilizadores" },
  { slug: "microfones", label: "Microfones" },
  { slug: "celulares", label: "Celulares" },
  { slug: "acessorios", label: "Acessórios" },
] as const;

/**
 * Chaves de `SiteSetting` que hoje são editáveis pelo painel
 * (`/admin/configuracoes`). Mantidas centralizadas aqui para não haver
 * strings soltas divergentes entre o formulário do admin e a leitura pública.
 */
export const SITE_SETTING_KEYS = {
  name: "site.name",
  whatsapp: "site.whatsapp",
  email: "site.email",
  address: "site.address",
} as const;

export type ResolvedSiteConfig = Omit<typeof siteConfig, "name" | "whatsapp" | "email"> & {
  /**
   * Campos que o painel administrativo (`/admin/configuracoes`) pode
   * sobrescrever em tempo de execução com um valor vindo do banco
   * (`SiteSetting`). Em `siteConfig` (acima) eles são tipos literais por
   * causa do `as const`, mas aqui — na versão "resolvida" — precisam
   * aceitar qualquer `string`, já que `getSiteConfig()` pode devolver o
   * valor cadastrado no admin, não apenas o literal padrão.
   */
  name: string;
  whatsapp: string;
  email: string;
  /**
   * Endereço em texto livre cadastrado em `/admin/configuracoes`
   * (chave `site.address`). Quando presente, deve ter prioridade sobre
   * `siteConfig.address` (que é apenas o valor padrão de fallback) na
   * exibição pública (ex.: rodapé).
   */
  addressText: string | null;
};

/**
 * Versão resolvida de `siteConfig`, combinando os valores padrão com o que
 * estiver salvo em `SiteSetting` (editado em `/admin/configuracoes`). Ver
 * `getSiteConfig()` em `@/lib/site-config-server` (só para uso em Server
 * Components).
 */

export const navLinks = [
  { href: "/produtos", label: "Produtos" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/novidades", label: "Novidades" },
  { href: "/assistencia-tecnica", label: "Assistência Técnica" },
  { href: "/empresa", label: "Empresa" },
  { href: "/contato", label: "Contato" },
] as const;
