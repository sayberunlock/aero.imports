"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error === "MUITAS_TENTATIVAS") {
      setError("Muitas tentativas de login. Aguarde alguns minutos e tente novamente.");
      return;
    }

    if (res?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center font-display text-xl font-medium text-cloud">
          AERO<span className="text-signal">IMPORTS</span>
          <span className="mt-1 block text-xs font-normal text-steel">Painel Administrativo</span>
        </p>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-cloud p-8 shadow-elevate">
          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-steel">
              E-mail
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-fog px-3 py-2.5 focus-within:border-signal">
              <Mail size={16} className="text-steel" />
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-steel">
              Senha
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-fog px-3 py-2.5 focus-within:border-signal">
              <Lock size={16} className="text-steel" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-steel">
          Acesso restrito à equipe Aero Imports.
        </p>
      </div>
    </div>
  );
}
