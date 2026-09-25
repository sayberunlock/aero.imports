import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteConfig } from "@/lib/site-config-server";
import { getPageContent, sanitizePageHtml } from "@/lib/pages";

const FALLBACK_TITLE = "Termos de Uso";
const FALLBACK_SEO_DESCRIPTION = "Termos e condições de uso do site e da loja virtual da Aero Imports.";

function buildFallbackContent(email: string) {
  return `
    <h2>1. Aceitação dos termos</h2>
    <p>Ao acessar e utilizar o site da Aero Imports, você concorda com estes Termos de Uso e com a
    nossa Política de Privacidade.</p>

    <h2>2. Cadastro e conta</h2>
    <p>Para realizar compras, pode ser necessário criar uma conta com dados verdadeiros e completos.
    Você é responsável por manter a confidencialidade da sua senha.</p>

    <h2>3. Preços e disponibilidade</h2>
    <p>Preços, condições de pagamento e disponibilidade de estoque podem ser alterados sem aviso
    prévio até a confirmação do pedido.</p>

    <h2>4. Pagamento e faturamento</h2>
    <p>Todos os pedidos são faturados com nota fiscal. Pagamentos são processados por gateways
    parceiros, que seguem seus próprios termos de segurança.</p>

    <h2>5. Trocas, devoluções e garantia</h2>
    <p>As condições de troca, devolução e garantia seguem o Código de Defesa do Consumidor e estão
    detalhadas na página de Garantia.</p>

    <h2>6. Propriedade intelectual</h2>
    <p>Todo o conteúdo do site — textos, imagens, logotipos e vídeos — é de propriedade da Aero
    Imports ou de seus licenciadores, sendo proibida a reprodução sem autorização.</p>

    <h2>7. Contato</h2>
    <p>Dúvidas sobre estes termos podem ser enviadas para ${email}.</p>
  `;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: FALLBACK_TITLE, description: FALLBACK_SEO_DESCRIPTION };
}

export default async function TermosDeUsoPage() {
  const config = await getSiteConfig();
  const page = await getPageContent("termos-de-uso", {
    title: FALLBACK_TITLE,
    content: buildFallbackContent(config.email),
    seoTitle: null,
    seoDescription: FALLBACK_SEO_DESCRIPTION,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      {/* Aviso jurídico: mantido sempre visível, independente do texto vir do
         banco ou do fallback — o item pendente aqui é a revisão jurídica do
         conteúdo (Fase 2), não a conexão com o banco (já feita). */}
      <div className="mb-10 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Revisão jurídica pendente:</strong> o texto abaixo (seja o padrão ou o editado em{" "}
        <code className="font-mono">/admin/paginas</code>) é um modelo genérico e deve ser revisado por
        um profissional jurídico antes da publicação definitiva do site.
      </div>

      <Reveal>
        <p className="eyebrow-mono text-signal">Legal</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">{page.title}</h1>
        <p className="mt-2 text-sm text-steel">Última atualização: a definir.</p>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="prose prose-slate mt-8 max-w-none text-steel"
          dangerouslySetInnerHTML={{ __html: sanitizePageHtml(page.content) }}
        />
      </Reveal>
    </div>
  );
}
