"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type BlogPostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  category: string;
  published: boolean;
};

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function BlogPostForm({ initial }: { initial?: BlogPostFormValues }) {
  const router = useRouter();
  const isEditing = Boolean(initial?.id);

  const [values, setValues] = useState<BlogPostFormValues>(
    initial ?? {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      authorName: "Equipe Aero Imports",
      category: "",
      published: false,
    }
  );
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const endpoint = isEditing ? `/api/admin/blog/${initial!.id}` : "/api/admin/blog";
    const method = isEditing ? "PATCH" : "POST";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível salvar o artigo.");
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id || !confirm("Excluir este artigo?")) return;
    await fetch(`/api/admin/blog/${initial.id}`, { method: "DELETE" });
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Título</span>
        <input
          required
          value={values.title}
          onChange={(e) => {
            const title = e.target.value;
            setValues((v) => ({ ...v, title, slug: slugTouched ? v.slug : slugify(title) }));
          }}
          className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Slug</span>
        <input
          required
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            setValues((v) => ({ ...v, slug: e.target.value }));
          }}
          className="w-full rounded-lg border border-fog px-3 py-2 font-mono text-xs outline-none focus:border-signal"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Autor</span>
          <input
            required
            value={values.authorName}
            onChange={(e) => setValues((v) => ({ ...v, authorName: e.target.value }))}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Categoria</span>
          <input
            value={values.category}
            onChange={(e) => setValues((v) => ({ ...v, category: e.target.value }))}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Imagem de capa (URL)</span>
        <input
          value={values.coverImage}
          onChange={(e) => setValues((v) => ({ ...v, coverImage: e.target.value }))}
          className="w-full rounded-lg border border-fog px-3 py-2 text-xs outline-none focus:border-signal"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Resumo</span>
        <textarea
          rows={2}
          value={values.excerpt}
          onChange={(e) => setValues((v) => ({ ...v, excerpt: e.target.value }))}
          className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Conteúdo</span>
        <textarea
          required
          rows={10}
          value={values.content}
          onChange={(e) => setValues((v) => ({ ...v, content: e.target.value }))}
          className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => setValues((v) => ({ ...v, published: e.target.checked }))}
          className="h-4 w-4 rounded border-fog text-signal focus:ring-signal"
        />
        Publicado (visível em /blog)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-aero px-6 py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Salvando…" : isEditing ? "Salvar alterações" : "Criar artigo"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Excluir
          </button>
        )}
      </div>
    </form>
  );
}
