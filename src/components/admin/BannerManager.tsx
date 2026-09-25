"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  active: boolean;
};

export function BannerManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subtitle, imageUrl, ctaLabel, ctaUrl, position: banners.length }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível criar o banner.");
      return;
    }

    setTitle("");
    setSubtitle("");
    setImageUrl("");
    setCtaLabel("");
    setCtaUrl("");
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/banners/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <form onSubmit={handleCreate} className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Novo banner</h2>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Título</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Subtítulo (opcional)</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">URL da imagem</span>
          <input
            required
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/…"
            className="w-full rounded-lg border border-fog px-3 py-2 text-xs outline-none focus:border-signal"
          />
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Texto do botão</span>
            <input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Link do botão</span>
            <input
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-aero py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Criando…" : "Criar banner"}
        </button>
      </form>

      <div className="space-y-4">
        {banners.length === 0 ? (
          <p className="rounded-2xl bg-cloud px-6 py-10 text-center text-sm text-steel shadow-card">
            Nenhum banner cadastrado ainda.
          </p>
        ) : (
          banners.map((b) => (
            <div key={b.id} className="flex gap-4 rounded-2xl bg-cloud p-4 shadow-card">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-fog">
                <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <p className="font-medium text-ink">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-steel">{b.subtitle}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(b.id, b.active)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      b.active ? "bg-emerald-100 text-emerald-700" : "bg-fog text-steel"
                    }`}
                  >
                    {b.active ? "Ativo" : "Inativo"}
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
