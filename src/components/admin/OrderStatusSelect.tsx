"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = [
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "EM_SEPARACAO",
  "ENVIADO",
  "ENTREGUE",
  "CANCELADO",
  "REEMBOLSADO",
];

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setCurrent(next);
    setSaving(true);
    const res = await fetch(`/api/admin/pedidos/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <select
      value={current}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-full border border-fog bg-cloud px-3 py-1 text-xs text-ink outline-none focus:border-signal"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
