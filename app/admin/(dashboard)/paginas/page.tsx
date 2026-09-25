import { db } from "@/lib/db";
import { PagesManager } from "@/components/admin/PagesManager";

export const dynamic = "force-dynamic";

export default async function AdminPaginasPage() {
  const pages = await db.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Páginas institucionais</h1>
      <p className="mt-1 text-sm text-steel">
        Edite textos institucionais como Empresa, FAQ e Garantia.
      </p>
      <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
        As páginas públicas atuais (/empresa, /faq, /garantia etc.) ainda exibem o texto provisório
        escrito diretamente no código. Conectar essas páginas a este conteúdo cadastrado aqui é o
        próximo passo pendente.
      </div>

      <div className="mt-6">
        <PagesManager pages={pages.map((p) => ({ id: p.id, slug: p.slug, title: p.title, content: p.content }))} />
      </div>
    </div>
  );
}
