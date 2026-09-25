"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Page = { id: string; slug: string; title: string; content: string };

export function PagesManager({ pages }: { pages: Page[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(pages[0]?.id ?? null);
  const selected = pages.find((p) => p.id === selectedId) ?? null;

  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await fetch("/api/admin/paginas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: newSlug, title: newTitle, content: "" }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível criar a página.");
      return;
    }
    setNewSlug("");
    setNewTitle("");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-1">
        {pages.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedId(p.id)}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
              selectedId === p.id ? "bg-aero text-cloud" : "text-ink hover:bg-fog"
            }`}
          >
            /{p.slug}
          </button>
        ))}

        <form onSubmit={handleCreate} className="mt-4 space-y-2 rounded-lg bg-cloud p-3 shadow-card">
          <p className="text-xs font-medium text-steel">Nova página</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <input
            required
            placeholder="slug"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="w-full rounded-md border border-fog px-2 py-1.5 text-xs outline-none focus:border-signal"
          />
          <input
            required
            placeholder="Título"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-md border border-fog px-2 py-1.5 text-xs outline-none focus:border-signal"
          />
          <button
            type="submit"
            disabled={creating}
            className="w-full rounded-md bg-ink py-1.5 text-xs font-medium text-cloud disabled:opacity-60"
          >
            {creating ? "Criando…" : "Criar"}
          </button>
        </form>
      </aside>

      <div className="rounded-2xl bg-cloud p-6 shadow-card">
        {!selected ? (
          <p className="text-sm text-steel">Nenhuma página selecionada.</p>
        ) : (
          <PageEditor key={selected.id} page={selected} onSaved={() => setSavedMsg("Salvo!")} />
        )}
        {savedMsg && <p className="mt-3 text-xs text-emerald-600">{savedMsg}</p>}
      </div>
    </div>
  );
}

function PageEditor({ page, onSaved }: { page: Page; onSaved: () => void }) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/admin/paginas/${page.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    onSaved();
    router.refresh();
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Título</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Conteúdo</span>
        <textarea
          rows={14}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-aero px-6 py-2.5 text-sm font-medium text-cloud hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Salvando…" : "Salvar página"}
      </button>
    </form>
  );
}
