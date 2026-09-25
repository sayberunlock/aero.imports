import DOMPurify from "isomorphic-dompurify";
import { db } from "@/lib/db";

export type PageContent = {
  title: string;
  /** HTML sanitizado (ver `renderPageHtml`) ou texto simples, conforme a página. */
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

/**
 * Busca o conteúdo de uma página institucional cadastrada em `/admin/paginas`
 * (modelo `Page`, por `slug`). Segue o mesmo padrão de `src/lib/products.ts`:
 * consulta o banco primeiro e só cai no conteúdo padrão (`fallback`) se não
 * existir registro ou se o campo `content` estiver vazio.
 *
 * Nunca lança: se o banco estiver indisponível, cai no fallback e registra
 * o erro no console — a página pública nunca deve quebrar por causa disso.
 */
export async function getPageContent(slug: string, fallback: PageContent): Promise<PageContent> {
  try {
    const page = await db.page.findUnique({ where: { slug } });
    if (page && page.content.trim().length > 0) {
      return {
        title: page.title?.trim() || fallback.title,
        content: page.content,
        seoTitle: page.seoTitle ?? fallback.seoTitle ?? null,
        seoDescription: page.seoDescription ?? fallback.seoDescription ?? null,
      };
    }
  } catch (error) {
    console.error(`[pages] Falha ao buscar a página "${slug}" no banco, usando conteúdo padrão.`, error);
  }
  return fallback;
}

/**
 * Sanitiza o HTML de uma página institucional antes de renderizar com
 * `dangerouslySetInnerHTML`. O campo `content` do modelo `Page` é um texto
 * livre editado em uma textarea simples em `/admin/paginas` — quem edita
 * pode digitar tags HTML (`<p>`, `<h2>`, etc.) para manter a formatação das
 * páginas institucionais. Nunca renderize `page.content` sem passar por
 * aqui primeiro.
 */
export function sanitizePageHtml(html: string): string {
  return DOMPurify.sanitize(html);
}
