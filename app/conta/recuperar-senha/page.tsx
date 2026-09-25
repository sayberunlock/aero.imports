"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecuperarSenhaPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    await fetch("/api/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    setStep("codigo");
  }

  async function handleResend() {
    setResending(true);
    setResendMsg(null);
    setError(null);
    await fetch("/api/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setResending(false);
    setResendMsg("Se este e-mail estiver cadastrado, um novo código foi enviado.");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/auth/redefinir-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, password }),
    });
    const data = await res.json().catch(() => null);
    setSubmitting(false);

    if (!res.ok) {
      setError(data?.message ?? "Não foi possível redefinir a senha.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/conta/login"), 2000);
  }

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Recuperar senha</h1>

      {done ? (
        <p className="mt-6 rounded-lg bg-fog px-4 py-4 text-sm text-ink">
          Senha redefinida com sucesso. Redirecionando para o login…
        </p>
      ) : step === "email" ? (
        <form onSubmit={handleSendCode} className="mt-8 space-y-4">
          <p className="text-sm text-steel">
            Informe o e-mail da sua conta e enviaremos um código de 6 dígitos para você criar uma nova
            senha.
          </p>
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
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Enviando…" : "Enviar código"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="mt-8 space-y-4">
          <p className="text-sm text-steel">
            Digite o código enviado para <strong className="text-ink">{email}</strong> e escolha sua nova
            senha.
          </p>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {resendMsg && <p className="rounded-lg bg-fog px-4 py-3 text-sm text-ink">{resendMsg}</p>}

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

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Confirmar nova senha</span>
            <input
              required
              type="password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-fog px-3 py-2.5 text-sm outline-none focus:border-signal"
            />
          </label>

          <button
            type="submit"
            disabled={submitting || code.length !== 6}
            className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Salvando…" : "Redefinir senha"}
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
      )}

      <p className="mt-6 text-center text-sm text-steel">
        <Link href="/conta/login" className="font-medium text-signal hover:underline">
          Voltar para o login
        </Link>
      </p>
    </div>
  );
}
