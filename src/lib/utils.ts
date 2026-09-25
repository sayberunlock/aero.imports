import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function installmentLabel(cents: number, maxInstallments = 12): string {
  const perInstallment = cents / maxInstallments;
  return `ou ${maxInstallments}x de ${formatBRL(perInstallment)} sem juros`;
}
