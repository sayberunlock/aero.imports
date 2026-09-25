"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="inline-flex items-center gap-2 rounded-full border border-steel-light px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-red-300 hover:text-red-600"
    >
      <LogOut size={15} />
      Sair da conta
    </button>
  );
}
