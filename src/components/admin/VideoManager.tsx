"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Video as VideoIcon } from "lucide-react";

type SiteVideo = {
  id: string;
  title: string;
  placement: string;
  url: string;
  active: boolean;
};

const PLACEMENTS = [
  { value: "home-hero", label: "Home — Hero" },
  { value: "empresa-destaque", label: "Empresa — Destaque" },
] as const;

const DEFAULT_PLACEMENT = PLACEMENTS[0].value;

export function VideoManager({ videos }: { videos: SiteVideo[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [placement, setPlacement] = useState<string>(DEFAULT_PLACEMENT);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, placement, url }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível cadastrar o vídeo.");
      return;
    }

    setTitle("");
    setUrl("");
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este vídeo?")) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <form onSubmit={handleCreate} className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Novo vídeo</h2>
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
          <span className="mb-1.5 block text-xs font-medium text-steel">Onde aparece</span>
          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          >
            {PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">URL do vídeo (.mp4)</span>
          <input
            required
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/…/video.mp4"
            className="w-full rounded-lg border border-fog px-3 py-2 text-xs outline-none focus:border-signal"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-aero py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Salvando…" : "Cadastrar vídeo"}
        </button>
      </form>

      <div className="space-y-4">
        {videos.length === 0 ? (
          <p className="rounded-2xl bg-cloud px-6 py-10 text-center text-sm text-steel shadow-card">
            Nenhum vídeo cadastrado ainda.
          </p>
        ) : (
          videos.map((v) => (
            <div key={v.id} className="flex items-center gap-4 rounded-2xl bg-cloud p-4 shadow-card">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-fog text-steel">
                <VideoIcon size={20} />
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{v.title}</p>
                  <p className="text-xs text-steel">{v.placement}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleActive(v.id, v.active)}
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      v.active ? "bg-emerald-100 text-emerald-700" : "bg-fog text-steel"
                    }`}
                  >
                    {v.active ? "Ativo" : "Inativo"}
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
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
