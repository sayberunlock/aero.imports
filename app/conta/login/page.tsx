"use client";

import { useState } from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/conta/perfil";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signIn("credentials", { email, password, redirect: false });
    setSubmitting(false);

    if (result?.error === "EMAIL_NAO_VERIFICADO") {
      setError("EMAIL_NAO_VERIFICADO");
      return;
    }

    if (result?.error === "MUITAS_TENTATIVAS") {
      setError("Muitas tentativas de login. Aguarde alguns minutos e tente novamente.");
      return;
    }

    if (result?.error) {
      setError("E-mail ou senha incorretos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Entrar</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error === "EMAIL_NAO_VERIFICADO" ? (
          <p className="rounded-lg bg-fog px-4 py-3 text-sm text-ink">
            Confirme seu e-mail antes de entrar.{" "}
            <Link
              href={`/conta/confirmar-email?email=${encodeURIComponent(email)}`}
              className="font-medium text-signal hover:underline"
            >
              Confirmar agora
            </Link>
          </p>
        ) : (
          error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

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
          <span className="mb-1.5 block text-xs font-medium text-steel">Senha</span>
          <input
            required
            type="password"
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
          {submitting ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-steel">
        Ainda não tem conta?{" "}
        <Link href="/conta/cadastro" className="font-medium text-signal hover:underline">
          Cadastre-se
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link href="/conta/recuperar-senha" className="text-steel hover:text-signal hover:underline">
          Esqueci minha senha
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
