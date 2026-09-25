import { db } from "@/lib/db";
import { siteConfig, SITE_SETTING_KEYS, type ResolvedSiteConfig } from "@/lib/site-config";

/**
 * Só pode ser importado por Server Components (páginas `async function` sem
 * "use client", como `app/layout.tsx`, `Footer.tsx`, `app/termos-de-uso`,
 * etc.). Nunca importe este arquivo de um componente "use client" — ele usa
 * o Prisma Client, que não roda no navegador.
 *
 * Retorna a configuração pública do site combinando os valores salvos em
 * `SiteSetting` (editados em `/admin/configuracoes`) com os valores padrão
 * definidos em `siteConfig` como fallback — o mesmo padrão usado em
 * `src/lib/products.ts` para o catálogo.
 *
 * Só sobrescreve os campos que o painel administrativo realmente edita hoje
 * (nome, WhatsApp, e-mail e endereço em texto livre). Os demais campos
 * (telefone, Instagram, horário de atendimento, URL) continuam vindo de
 * `siteConfig` até que existam campos correspondentes no admin — assim
 * evitamos sugerir, na UI, que algo é editável quando não é.
 *
 * Nunca lança: se o banco estiver indisponível, cai no fallback estático
 * e registra o erro no console.
 */
export async function getSiteConfig(): Promise<ResolvedSiteConfig> {
  try {
    const settings = await db.siteSetting.findMany({
      where: { key: { in: Object.values(SITE_SETTING_KEYS) } },
    });
    const values = Object.fromEntries(settings.map((s: { key: string; value: string }) => [s.key, s.value]));

    return {
      ...siteConfig,
      name: values[SITE_SETTING_KEYS.name]?.trim() || siteConfig.name,
      whatsapp: values[SITE_SETTING_KEYS.whatsapp]?.trim() || siteConfig.whatsapp,
      email: values[SITE_SETTING_KEYS.email]?.trim() || siteConfig.email,
      addressText: values[SITE_SETTING_KEYS.address]?.trim() || null,
    };
  } catch (error) {
    console.error("[site-config-server] Falha ao ler SiteSetting no banco, usando valores padrão.", error);
    return { ...siteConfig, addressText: null };
  }
}
