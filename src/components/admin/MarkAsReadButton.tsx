"use client";

import { useRouter } from "next/navigation";

export function MarkAsReadButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleClick() {
    await fetch(`/api/admin/mensagens/${id}`, { method: "PATCH" });
    router.refresh();
  }

  return (
    <button onClick={handleClick} className="text-xs font-medium text-signal hover:underline">
      Marcar como lida
    </button>
  );
}
