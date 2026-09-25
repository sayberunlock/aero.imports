"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/redefinir-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível redefinir a senha.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/conta/login"), 2000);
  }

  if (!token) {
    return (
      <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
        Link inválido. Solicite uma nova redefinição de senha.
      </p>
    );
  }

  if (done) {
    return (
      <p className="mt-6 rounded-lg bg-fog px-4 py-4 text-sm text-ink">
        Senha redefinida com sucesso. Redirecionando para o login…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-steel">Nova senha</span>
        <input
          required
          type="password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-fog px-3 py-2.5 text-sm outline-none focus:border-signal"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Salvando…" : "Redefinir senha"}
      </button>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Definir nova senha</h1>
      <Suspense fallback={null}>
        <ResetForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-steel">
        <Link href="/conta/login" className="font-medium text-signal hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
