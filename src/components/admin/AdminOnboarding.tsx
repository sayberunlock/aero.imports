"use client";

import { X, type LucideIcon } from "lucide-react";

export type OnboardingSection = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

type Props = {
  open: boolean;
  onClose: () => void;
  sections: OnboardingSection[];
};

/**
 * Tutorial exibido automaticamente no primeiro acesso ao painel admin
 * (controlado via localStorage em app/admin/(dashboard)/layout.tsx —
 * "novo acesso" aqui significa "neste navegador", já que não criamos
 * uma coluna nova no banco pra isso). Também pode ser reaberto a
 * qualquer momento pelo botão "Ajuda" na barra lateral.
 */
export function AdminOnboarding({ open, onClose, sections }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-cloud shadow-elevate">
        <div className="flex items-center justify-between border-b border-fog px-6 py-5">
          <div>
            <p className="eyebrow-mono text-signal">Bem-vindo</p>
            <h2 className="mt-1 font-display text-lg font-medium text-ink">
              O que cada aba do painel faz
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar tutorial"
            className="flex h-9 w-9 items-center justify-center rounded-full text-steel hover:bg-fog hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <ul className="space-y-4">
            {sections.map((s) => (
              <li key={s.label} className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-fog text-signal">
                  <s.icon size={17} strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{s.label}</p>
                  <p className="mt-0.5 text-sm text-steel">{s.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-fog px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90"
          >
            Entendi, começar a usar
          </button>
        </div>
      </div>
    </div>
  );
}
