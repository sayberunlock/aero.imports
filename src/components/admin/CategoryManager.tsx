"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

type Category = { id: string; name: string; slug: string; _count: { products: number } };

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slug || slugify(name) }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível criar a categoria.");
      return;
    }

    setName("");
    setSlug("");
    setSlugTouched(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta categoria?")) return;
    const res = await fetch(`/api/admin/categorias/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(data?.message ?? "Não foi possível excluir a categoria.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <form onSubmit={handleCreate} className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Nova categoria</h2>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Nome</span>
          <input
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Slug</span>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="w-full rounded-lg border border-fog px-3 py-2 font-mono text-xs outline-none focus:border-signal"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-aero py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Criando…" : "Criar categoria"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-cloud shadow-card">
        {categories.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-steel">Nenhuma categoria cadastrada ainda.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">Produtos</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-3 text-ink">{c.name}</td>
                  <td className="px-6 py-3 font-mono text-xs text-steel">{c.slug}</td>
                  <td className="px-6 py-3 text-steel">{c._count.products}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
