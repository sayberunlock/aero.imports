"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/auth/recuperar-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitting(false);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Recuperar senha</h1>

      {sent ? (
        <p className="mt-6 rounded-lg bg-fog px-4 py-4 text-sm text-ink">
          Se este e-mail estiver cadastrado, você receberá um link de redefinição em instantes. Verifique
          também a caixa de spam.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <p className="text-sm text-steel">
            Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
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
            {submitting ? "Enviando…" : "Enviar link de redefinição"}
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
