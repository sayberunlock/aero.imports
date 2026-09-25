import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { AutoPlayVideo } from "@/components/ui/AutoPlayVideo";
import { getPageContent, sanitizePageHtml } from "@/lib/pages";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const FALLBACK = {
  title: "Tecnologia de voo com precisão de solo.",
  content: `
    <p>
      A Aero Imports nasceu com um propósito simples: aproximar
      profissionais e entusiastas brasileiros da tecnologia DJI com a
      segurança, a procedência e o suporte que esse tipo de equipamento
      exige. Como loja autorizada, cada drone, câmera ou estabilizador
      que sai da Aero Imports carrega nota fiscal, garantia e o
      respaldo de uma equipe que entende de voo tanto quanto entende de
      atendimento.
    </p>
    <p>
      Ao longo dos últimos anos, consolidamos uma operação pensada para
      quem depende de precisão no trabalho — cineastas, agrimensores,
      produtoras, criadores de conteúdo e empresas de inspeção — sem
      deixar de lado quem está começando a explorar o universo dos
      drones e da produção audiovisual.
    </p>
  `,
  seoTitle: null,
  seoDescription:
    "Conheça a história, missão, visão e valores da Aero Imports, loja autorizada DJI no Brasil.",
};

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent("empresa", FALLBACK);
  return {
    title: "Empresa",
    description: page.seoDescription ?? FALLBACK.seoDescription,
  };
}

export default async function EmpresaPage() {
  const page = await getPageContent("empresa", FALLBACK);

  // Vídeo institucional cadastrado no painel (/admin/videos, placement
  // "empresa-destaque") — mesmo padrão usado no Hero da Home (app/page.tsx).
  // Se não houver vídeo ativo cadastrado, a seção simplesmente não aparece
  // (nada de placeholder fake fingindo ser conteúdo real).
  const featuredVideo = await db.siteVideo
    .findFirst({ where: { placement: "empresa-destaque", active: true }, orderBy: { createdAt: "desc" } })
    .catch(() => null);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-10">
      <Reveal>
        <p className="eyebrow-mono text-signal">Empresa</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">{page.title}</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="prose prose-slate mt-8 max-w-none text-steel"
          dangerouslySetInnerHTML={{ __html: sanitizePageHtml(page.content) }}
        />
      </Reveal>

      {featuredVideo && (
        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-2xl bg-ink shadow-elevate">
            {/* Toca sozinho e mudo; os controles continuam para ligar o som ou pausar. */}
            <AutoPlayVideo
              className="aspect-video w-full object-cover"
              src={featuredVideo.url}
              poster={featuredVideo.thumbnailUrl ?? undefined}
              controls
              preload="metadata"
            />
          </div>
          <p className="mt-2 text-center text-xs text-steel">{featuredVideo.title}</p>
        </Reveal>
      )}

      <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
        <Pillar
          title="Missão"
          text="Entregar tecnologia DJI original, com procedência garantida e suporte técnico de verdade, a todo o Brasil."
        />
        <Pillar
          title="Visão"
          text="Ser a referência nacional em vendas e suporte técnico de equipamentos DJI para uso profissional e criativo."
        />
        <Pillar
          title="Valores"
          text="Transparência, precisão, atendimento humano e compromisso com a segurança de quem opera nossos equipamentos."
        />
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 border-t border-fog pt-10">
          <h2 className="font-display text-xl font-medium text-ink">Nosso compromisso</h2>
          <p className="mt-3 text-steel">
            Trabalhamos exclusivamente com produtos originais, importados por
            canais oficiais, e mantemos uma equipe de assistência técnica
            especializada para calibração, manutenção e suporte pós-venda —
            porque um equipamento em voo não pode depender de um fornecedor
            sem lastro.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function Pillar({ title, text }: { title: string; text: string }) {
  return (
    <Reveal>
      <div>
        <h3 className="font-display text-base font-medium text-aero">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-steel">{text}</p>
      </div>
    </Reveal>
  );
}
