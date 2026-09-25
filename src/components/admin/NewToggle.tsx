"use client";

import { useRouter } from "next/navigation";

export function NewToggle({ id, isNew }: { id: string; isNew: boolean }) {
  const router = useRouter();

  async function handleClick() {
    await fetch(`/api/admin/novidades/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isNew: !isNew }),
    });
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        isNew ? "bg-signal text-cloud" : "bg-fog text-steel"
      }`}
    >
      {isNew ? "Marcado como Novo" : "Marcar como Novo"}
    </button>
  );
}
