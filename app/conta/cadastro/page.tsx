"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível criar sua conta.");
      setSubmitting(false);
      return;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (result?.error) {
      router.push("/conta/login");
      return;
    }

    router.push("/conta/perfil");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Criar conta</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Nome completo</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2.5 text-sm outline-none focus:border-signal"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">E-mail</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2.5 text-sm outline-none focus:border-signal"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Telefone (opcional)</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-fog px-3 py-2.5 text-sm outline-none focus:border-signal"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Senha</span>
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
          {submitting ? "Criando conta…" : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-steel">
        Já tem conta?{" "}
        <Link href="/conta/login" className="font-medium text-signal hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
