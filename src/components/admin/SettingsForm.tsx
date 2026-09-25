"use client";

import { useState } from "react";

type Field = { key: string; label: string; hint?: string; multiline?: boolean };

export function SettingsForm({
  fields,
  values: initialValues,
}: {
  fields: Field[];
  values: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);

    await fetch("/api/admin/configuracoes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-2xl bg-cloud p-6 shadow-card">
      {fields.map((field) => (
        <label key={field.key} className="block">
          <span className="mb-1.5 block text-xs font-medium text-steel">{field.label}</span>
          {field.multiline ? (
            <textarea
              rows={3}
              value={values[field.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          ) : (
            <input
              value={values[field.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
              className="w-full rounded-lg border border-fog px-3 py-2 text-sm outline-none focus:border-signal"
            />
          )}
          {field.hint && <span className="mt-1 block text-xs text-steel">{field.hint}</span>}
        </label>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-aero px-6 py-2.5 text-sm font-medium text-cloud hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Salvando…" : "Salvar"}
        </button>
        {saved && <span className="text-sm text-emerald-600">Salvo!</span>}
      </div>
    </form>
  );
}
