"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.message ?? "Não foi possível alterar a senha.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm rounded-2xl bg-cloud p-8 shadow-elevate">
        <div className="mb-6 flex items-center gap-2 text-ink">
          <KeyRound size={20} className="text-signal" />
          <h1 className="font-display text-lg font-medium">Defina uma nova senha</h1>
        </div>
        <p className="mb-6 text-sm text-steel">
          Este é o primeiro acesso ao painel. Por segurança, você precisa
          definir uma senha exclusiva antes de continuar.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Senha atual"
            type="password"
            value={form.currentPassword}
            onChange={(v) => setForm((f) => ({ ...f, currentPassword: v }))}
          />
          <Field
            label="Nova senha"
            type="password"
            value={form.newPassword}
            onChange={(v) => setForm((f) => ({ ...f, newPassword: v }))}
            hint="Mínimo 10 caracteres, com letra maiúscula e número."
          />
          <Field
            label="Confirmar nova senha"
            type="password"
            value={form.confirmPassword}
            onChange={(v) => setForm((f) => ({ ...f, confirmPassword: v }))}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Salvando…" : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  hint,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-steel">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-fog px-3 py-2.5 text-sm outline-none focus:border-signal"
      />
      {hint && <p className="mt-1 text-xs text-steel">{hint}</p>}
    </div>
  );
}
