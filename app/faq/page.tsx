import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { getPageContent, sanitizePageHtml } from "@/lib/pages";

const FALLBACK_TITLE = "Perguntas frequentes";
const FALLBACK_SEO_DESCRIPTION =
  "Tire suas dúvidas sobre compra, entrega, garantia e assistência técnica de produtos DJI na Aero Imports.";
const FALLBACK_CONTENT =
  "Reunimos as dúvidas mais comuns sobre compra, entrega, garantia e assistência técnica. Não " +
  "encontrou o que procurava? Fale com a gente pelo WhatsApp ou pela página de Contato.";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Perguntas Frequentes", description: FALLBACK_SEO_DESCRIPTION };
}

const faqItems = [
  {
    question: "Os produtos são originais e possuem nota fiscal?",
    answer:
      "Sim. Todos os produtos vendidos pela Aero Imports são originais, importados por canais autorizados, e acompanham nota fiscal em todas as vendas.",
  },
  {
    question: "Qual é o prazo de entrega?",
    answer:
      "O prazo varia conforme a região e a modalidade de frete escolhida no checkout. Após a confirmação do pagamento, você recebe um código de rastreio por e-mail.",
  },
  {
    question: "Como funciona a garantia dos produtos?",
    answer:
      "Todos os produtos possuem garantia do fabricante, e a Aero Imports oferece suporte para acionamento da garantia e assistência técnica especializada. Veja mais detalhes na página de Garantia.",
  },
  {
    question: "Posso parcelar minha compra?",
    answer:
      "Sim, aceitamos parcelamento no cartão de crédito em até 12x, conforme condições exibidas na página de cada produto.",
  },
  {
    question: "Como faço para trocar ou devolver um produto?",
    answer:
      "Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor. Entre em contato pelo WhatsApp ou pela nossa página de Contato para iniciar o processo.",
  },
  {
    question: "A Aero Imports faz assistência técnica de equipamentos que não foram comprados com vocês?",
    answer:
      "Sim, nossa equipe técnica atende equipamentos DJI de qualquer origem. Consulte a página de Assistência Técnica para mais informações.",
  },
];

export default async function FaqPage() {
  const page = await getPageContent("faq", {
    title: FALLBACK_TITLE,
    content: FALLBACK_CONTENT,
    seoTitle: null,
    seoDescription: FALLBACK_SEO_DESCRIPTION,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      <Reveal>
        <p className="eyebrow-mono text-signal">Ajuda</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">{page.title}</h1>
        <div
          className="prose prose-slate mt-4 max-w-none text-steel"
          dangerouslySetInnerHTML={{ __html: sanitizePageHtml(page.content) }}
        />
      </Reveal>

      {/* As perguntas/respostas continuam fixas no código (`faqItems`) — o
         modelo `Page` guarda apenas título + um texto de introdução, não uma
         lista estruturada de perguntas. Para tornar isso editável pelo admin
         seria necessário um modelo dedicado (ex. `FaqItem`). */}
      <Reveal delay={0.1} className="mt-10">
        <FaqAccordion items={faqItems} />
      </Reveal>
    </div>
  );
}
