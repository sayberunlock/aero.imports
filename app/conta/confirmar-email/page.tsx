"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmarEmailForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/auth/confirmar-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json().catch(() => null);
    setSubmitting(false);

    if (!res.ok) {
      setError(data?.message ?? "Não foi possível confirmar o e-mail.");
      return;
    }

    setDone(true);
  }

  async function handleResend() {
    if (!email) {
      setError("Informe seu e-mail para reenviar o código.");
      return;
    }
    setResending(true);
    setResendMsg(null);
    setError(null);
    const res = await fetch("/api/auth/reenviar-confirmacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => null);
    setResending(false);
    setResendMsg(data?.message ?? "Se houver um cadastro pendente, um novo código foi enviado.");
  }

  if (done) {
    return (
      <p className="mt-6 rounded-lg bg-fog px-4 py-4 text-sm text-ink">
        E-mail confirmado com sucesso!{" "}
        <Link href="/conta/login" className="font-medium text-signal hover:underline">
          Ir para o login
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {resendMsg && <p className="rounded-lg bg-fog px-4 py-3 text-sm text-ink">{resendMsg}</p>}

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
        <span className="mb-1.5 block text-xs font-medium text-steel">Código de 6 dígitos</span>
        <input
          required
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          className="w-full rounded-lg border border-fog px-3 py-2.5 text-center font-display text-lg tracking-[0.4em] outline-none focus:border-signal"
        />
      </label>

      <button
        type="submit"
        disabled={submitting || code.length !== 6}
        className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Confirmando…" : "Confirmar e-mail"}
      </button>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="w-full text-center text-sm text-steel hover:text-signal hover:underline disabled:opacity-60"
      >
        {resending ? "Enviando…" : "Reenviar código"}
      </button>
    </form>
  );
}

export default function ConfirmarEmailPage() {
  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Confirmar e-mail</h1>
      <p className="mt-3 text-sm text-steel">
        Enviamos um código de 6 dígitos para o seu e-mail. Digite-o abaixo para ativar sua conta.
      </p>
      <Suspense fallback={null}>
        <ConfirmarEmailForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-steel">
        <Link href="/conta/login" className="font-medium text-signal hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
