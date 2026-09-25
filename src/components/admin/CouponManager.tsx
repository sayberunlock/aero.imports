"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { formatBRL } from "@/lib/utils";

type Coupon = {
  id: string;
  code: string;
  percentOff: number | null;
  amountOffCents: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
};

export function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [percentOff, setPercentOff] = useState("");
  const [amountOff, setAmountOff] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin/cupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        percentOff: percentOff ? parseInt(percentOff, 10) : null,
        amountOffCents: amountOff ? Math.round(parseFloat(amountOff) * 100) : null,
        maxUses: maxUses ? parseInt(maxUses, 10) : null,
        expiresAt: expiresAt || null,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message ?? "Não foi possível criar o cupom.");
      return;
    }

    setCode("");
    setPercentOff("");
    setAmountOff("");
    setMaxUses("");
    setExpiresAt("");
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/cupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este cupom?")) return;
    await fetch(`/api/admin/cupons/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={handleCreate} className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Novo cupom</h2>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-medium text-steel">Código</span>
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full rounded-lg border border-fog px-3 py-2 font-mono text-sm outline-none focus:border-signal"
          />
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Desconto (%)</span>
            <input
              type="number"
              min={1}
              max={100}
              value={percentOff}
              onChange={(e) => {
                setPercentOff(e.target.value);
                if (e.target.value) setAmountOff("");
              }}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">ou valor fixo (R$)</span>
            <input
              type="number"
              min={1}
              step="0.01"
              value={amountOff}
              onChange={(e) => {
                setAmountOff(e.target.value);
                if (e.target.value) setPercentOff("");
              }}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </label>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Usos máximos</span>
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
              placeholder="Ilimitado"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium text-steel">Expira em</span>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-full bg-aero py-2.5 text-sm font-medium text-cloud transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Criando…" : "Criar cupom"}
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl bg-cloud shadow-card">
        {coupons.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-steel">Nenhum cupom cadastrado ainda.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
              <tr>
                <th className="px-6 py-3 font-medium">Código</th>
                <th className="px-6 py-3 font-medium">Desconto</th>
                <th className="px-6 py-3 font-medium">Usos</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-fog last:border-0">
                  <td className="px-6 py-3 font-mono text-ink">{c.code}</td>
                  <td className="px-6 py-3 text-steel">
                    {c.percentOff ? `${c.percentOff}%` : c.amountOffCents ? formatBRL(c.amountOffCents) : "—"}
                  </td>
                  <td className="px-6 py-3 text-steel">
                    {c.usedCount}
                    {c.maxUses ? ` / ${c.maxUses}` : ""}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => toggleActive(c.id, c.active)}
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        c.active ? "bg-emerald-100 text-emerald-700" : "bg-fog text-steel"
                      }`}
                    >
                      {c.active ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:underline"
                    >
                      <Trash2 size={14} />
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
