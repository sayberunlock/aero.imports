import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Blog</h1>
          <p className="mt-1 text-sm text-steel">{posts.length} artigo(s).</p>
        </div>
        <Link
          href="/admin/blog/novo"
          className="flex items-center gap-2 rounded-full bg-aero px-5 py-2.5 text-sm font-medium text-cloud hover:opacity-90"
        >
          <Plus size={16} />
          Novo artigo
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-cloud shadow-card">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-steel">
            <FileText size={28} />
            <p className="text-sm">Nenhum artigo criado ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Título</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-4 text-ink">{p.title}</td>
                  <td className="px-6 py-4 text-steel">{p.category ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.published ? "bg-emerald-100 text-emerald-700" : "bg-fog text-steel"
                      }`}
                    >
                      {p.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/blog/${p.id}`} className="text-sm font-medium text-signal hover:underline">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
