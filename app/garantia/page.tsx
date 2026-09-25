import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Wrench, FileCheck, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";
import { getPageContent, sanitizePageHtml } from "@/lib/pages";

const FALLBACK_TITLE = "Garantia";
const FALLBACK_SEO_DESCRIPTION =
  "Entenda como funciona a garantia dos produtos DJI vendidos pela Aero Imports e como acioná-la.";
const FALLBACK_CONTENT =
  "Todos os produtos vendidos pela Aero Imports possuem garantia do fabricante contra defeitos de " +
  "fabricação, além do suporte da nossa equipe técnica especializada em equipamentos DJI.";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return { title: FALLBACK_TITLE, description: FALLBACK_SEO_DESCRIPTION };
}

const steps = [
  {
    icon: FileCheck,
    title: "Guarde a nota fiscal",
    text: "A nota fiscal enviada por e-mail é o comprovante de garantia — guarde-a com o número do pedido.",
  },
  {
    icon: MessageCircle,
    title: "Entre em contato",
    text: "Fale com nossa equipe pelo WhatsApp ou pela página de Contato descrevendo o problema encontrado.",
  },
  {
    icon: Wrench,
    title: "Diagnóstico técnico",
    text: "Nossa equipe de Assistência Técnica avalia o equipamento e orienta os próximos passos.",
  },
  {
    icon: ShieldCheck,
    title: "Reparo ou substituição",
    text: "Conforme o diagnóstico e os termos do fabricante, o equipamento é reparado ou substituído.",
  },
];

export default async function GarantiaPage() {
  const page = await getPageContent("garantia", {
    title: FALLBACK_TITLE,
    content: FALLBACK_CONTENT,
    seoTitle: null,
    seoDescription: FALLBACK_SEO_DESCRIPTION,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      {/* Este aviso é sobre os PRAZOS/PASSOS abaixo (array `steps`, fixo no
         código — não faz parte do modelo `Page`), não sobre o título/texto
         de introdução, que já vem de `/admin/paginas` com fallback. */}
      <div className="mb-10 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Conteúdo provisório:</strong> os prazos e condições abaixo são exemplos e devem ser
        confirmados com os termos oficiais dos fabricantes antes da publicação definitiva.
      </div>

      <Reveal>
        <p className="eyebrow-mono text-signal">Suporte</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">{page.title}</h1>
        <div
          className="prose prose-slate mt-4 max-w-none text-steel"
          dangerouslySetInnerHTML={{ __html: sanitizePageHtml(page.content) }}
        />
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl bg-cloud p-6 shadow-card">
              <step.icon size={22} className="text-signal" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-base font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-steel">{step.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-12 rounded-2xl bg-ink p-8 text-center">
        <p className="text-cloud">Precisa acionar a garantia ou tirar uma dúvida técnica?</p>
        <Link
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-medium text-cloud transition-transform hover:scale-[1.03]"
        >
          <MessageCircle size={16} />
          Falar no WhatsApp
        </Link>
      </Reveal>
    </div>
  );
}
