"use client";

import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * "Comprar agora" — atalho fora do carrinho (Passo 2 do checkout via
 * WhatsApp). Monta a mesma mensagem estruturada do carrinho, mas só com
 * este produto (quantidade 1), e abre o WhatsApp direto.
 */
export function BuyNowButton({
  productName,
  unitPriceCents,
  whatsappNumber,
}: {
  productName: string;
  unitPriceCents: number;
  whatsappNumber: string;
}) {
  const { data: session } = useSession();

  function handleClick() {
    const message = buildOrderWhatsAppMessage(
      [{ name: productName, quantity: 1, unitPriceCents }],
      session?.user?.name
    );
    window.open(buildWhatsAppUrl(whatsappNumber, message), "_blank", "noopener,noreferrer");
  }

  return (
    <button
      onClick={handleClick}
      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-aero px-7 py-3.5 text-sm font-medium text-cloud transition-transform duration-300 ease-aero hover:scale-[1.02]"
    >
      <MessageCircle size={16} />
      Comprar agora
    </button>
  );
}
