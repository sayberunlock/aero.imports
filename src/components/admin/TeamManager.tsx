"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Trash2, User } from "lucide-react";

type Member = { id: string; name: string; role: string; photoUrl: string | null };

export function TeamManager({ members }: { members: Member[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/equipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, role, photoUrl, position: members.length }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível adicionar.");
      return;
    }

    setName("");
    setRole("");
    setPhotoUrl("");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este integrante?")) return;
    await fetch(`/api/admin/equipe/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <form onSubmit={handleCreate} className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Novo integrante</h2>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Nome</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Cargo</span>
          <input
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Foto (URL, opcional)</span>
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-xs outline-none focus:border-signal"
          />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-aero py-2.5 text-sm font-medium text-cloud hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Adicionando…" : "Adicionar"}
        </button>
      </form>

      <div className="space-y-3">
        {members.length === 0 ? (
          <p className="rounded-2xl bg-cloud px-6 py-10 text-center text-sm text-steel shadow-card">
            Nenhum integrante cadastrado ainda.
          </p>
        ) : (
          members.map((m) => (
            <div key={m.id} className="flex items-center gap-4 rounded-2xl bg-cloud p-4 shadow-card">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-fog text-steel">
                {m.photoUrl ? <Image src={m.photoUrl} alt={m.name} fill className="object-cover" /> : <User size={18} />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">{m.name}</p>
                <p className="text-xs text-steel">{m.role}</p>
              </div>
              <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
