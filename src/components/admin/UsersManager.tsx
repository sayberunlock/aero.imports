"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StaffUser = { id: string; name: string; email: string; role: string; createdAt: string };

export function UsersManager({ users }: { users: StaffUser[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPPORT">("SUPPORT");
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setTempPassword(null);

    const res = await fetch("/api/admin/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, role }),
    });
    const data = await res.json().catch(() => null);
    setSubmitting(false);

    if (!res.ok) {
      setError(data?.message ?? "Não foi possível criar o usuário.");
      return;
    }

    setTempPassword(data.tempPassword);
    setName("");
    setEmail("");
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <form onSubmit={handleCreate} className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Novo usuário do painel</h2>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {tempPassword && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Conta criada. Senha temporária: <strong className="font-mono">{tempPassword}</strong> — o
            usuário precisará trocá-la no primeiro acesso.
          </p>
        )}
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
          <span className="mb-1.5 block text-xs font-medium text-steel">E-mail</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Papel</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "SUPPORT")}
            className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
          >
            <option value="SUPPORT">Suporte</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-aero py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Criando…" : "Criar usuário"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-cloud shadow-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
            <tr>
              <th className="px-6 py-3 font-medium">Nome</th>
              <th className="px-6 py-3 font-medium">E-mail</th>
              <th className="px-6 py-3 font-medium">Papel</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-fog last:border-0">
                <td className="px-6 py-3 text-ink">{u.name}</td>
                <td className="px-6 py-3 text-steel">{u.email}</td>
                <td className="px-6 py-3 text-steel">{u.role === "ADMIN" ? "Administrador" : "Suporte"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
