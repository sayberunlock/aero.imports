import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { getSiteConfig } from "@/lib/site-config-server";
import { getPageContent, sanitizePageHtml } from "@/lib/pages";

const FALLBACK_TITLE = "Política de Privacidade";
const FALLBACK_SEO_DESCRIPTION = "Saiba como a Aero Imports coleta, usa e protege seus dados pessoais.";

function buildFallbackContent(email: string) {
  return `
    <h2>1. Quais dados coletamos</h2>
    <p>Coletamos dados fornecidos diretamente por você ao criar uma conta, finalizar uma compra ou
    entrar em contato conosco — como nome, e-mail, telefone, endereço e dados de pagamento
    (processados por gateways parceiros, nunca armazenados diretamente por nós).</p>

    <h2>2. Como usamos seus dados</h2>
    <p>Utilizamos seus dados para processar pedidos, emitir nota fiscal, prestar suporte, cumprir
    obrigações legais e, quando autorizado, enviar comunicações sobre novidades e promoções.</p>

    <h2>3. Compartilhamento de dados</h2>
    <p>Compartilhamos dados apenas com parceiros essenciais à operação — transportadoras, gateways
    de pagamento e serviços de e-mail transacional — e nunca vendemos dados pessoais a terceiros.</p>

    <h2>4. Seus direitos</h2>
    <p>Nos termos da Lei Geral de Proteção de Dados (LGPD), você pode solicitar acesso, correção,
    portabilidade ou exclusão dos seus dados a qualquer momento, entrando em contato pelo e-mail
    ${email}.</p>

    <h2>5. Cookies</h2>
    <p>Usamos cookies para melhorar sua experiência de navegação e medir o desempenho do site. Você
    pode gerenciar preferências de cookies diretamente no seu navegador.</p>

    <h2>6. Contato</h2>
    <p>Dúvidas sobre esta política podem ser enviadas para ${email} ou pela nossa página
    de Contato.</p>
  `;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: FALLBACK_TITLE, description: FALLBACK_SEO_DESCRIPTION };
}

export default async function PoliticaDePrivacidadePage() {
  const config = await getSiteConfig();
  const page = await getPageContent("politica-de-privacidade", {
    title: FALLBACK_TITLE,
    content: buildFallbackContent(config.email),
    seoTitle: null,
    seoDescription: FALLBACK_SEO_DESCRIPTION,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      {/* Aviso jurídico: mantido sempre visível — o pendente é a revisão
         jurídica do conteúdo (Fase 2), já não é mais a conexão com o banco. */}
      <div className="mb-10 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Revisão jurídica pendente:</strong> o texto abaixo (seja o padrão ou o editado em{" "}
        <code className="font-mono">/admin/paginas</code>) é um modelo genérico baseado na LGPD e deve
        ser revisado por um profissional jurídico antes da publicação definitiva do site.
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
