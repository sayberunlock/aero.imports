"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatBRL } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { buildOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

const FREE_SHIPPING_THRESHOLD_CENTS = 500000; // R$ 5.000
const FLAT_SHIPPING_CENTS = 4990; // R$ 49,90

export default function CarrinhoPage() {
  const { items, updateQuantity, removeItem, subtotalCents, itemCount, clear } = useCart();
  const { data: session } = useSession();
  const [redirected, setRedirected] = useState(false);

  const shippingCents = items.length === 0 || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
  const totalCents = subtotalCents + shippingCents;

  // Checkout via WhatsApp (Opção A — ver src/lib/whatsapp.ts para o motivo):
  // não chamamos mais /api/pedidos aqui. Login não é mais obrigatório para
  // finalizar, já que o fechamento da venda acontece por conversa direta;
  // se houver sessão, usamos o nome do cliente na mensagem.
  function handleCheckout() {
    if (items.length === 0) return;

    const message = buildOrderWhatsAppMessage(
      items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
      })),
      session?.user?.name
    );

    window.open(buildWhatsAppUrl(siteConfig.whatsapp, message), "_blank", "noopener,noreferrer");
    clear();
    setRedirected(true);
  }

  if (redirected) {
    return (
      <div className="mx-auto max-w-lg px-6 pb-24 pt-40 text-center">
        <MessageCircle size={32} className="mx-auto text-signal" />
        <h1 className="mt-4 font-display text-display-md font-medium text-ink">Quase lá!</h1>
        <p className="mt-2 text-steel">
          Abrimos o WhatsApp com o resumo do seu pedido. Continue a conversa por lá para combinar
          pagamento, frete e prazo de entrega com nossa equipe.
        </p>
        <Link href="/produtos" className="mt-6 inline-block text-sm font-medium text-signal hover:underline">
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <header className="mb-10">
        <p className="eyebrow-mono text-signal">Sua compra</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">Carrinho</h1>
        <p className="mt-2 text-sm text-steel">
          {itemCount} ite{itemCount === 1 ? "m" : "ns"} no carrinho.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-steel-light bg-fog/60 px-6 py-20 text-center">
          <ShoppingBag size={28} className="text-steel" />
          <p className="text-sm text-steel">Seu carrinho está vazio.</p>
          <Link href="/produtos" className="text-sm font-medium text-signal hover:underline">
            Explorar catálogo
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.slug} className="flex gap-4 rounded-2xl bg-cloud p-4 shadow-card">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-fog">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="eyebrow-mono text-steel">{item.brand}</p>
                    <p className="font-medium text-ink">{item.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-fog px-2 py-1">
                      <button
                        aria-label="Diminuir quantidade"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-steel hover:bg-fog"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-sm text-ink">{item.quantity}</span>
                      <button
                        aria-label="Aumentar quantidade"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-steel hover:bg-fog"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-display font-medium text-aero">
                      {formatBRL(item.unitPriceCents * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  aria-label="Remover item"
                  onClick={() => removeItem(item.slug)}
                  className="self-start text-steel hover:text-red-600"
                >
                  <Trash2 size={17} />
                </button>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-2xl bg-cloud p-6 shadow-card">
            <h2 className="font-display text-lg font-medium text-ink">Resumo do pedido</h2>
            <div className="mt-4 space-y-2 text-sm text-steel">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-ink">{formatBRL(subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className="text-ink">{shippingCents === 0 ? "Grátis" : formatBRL(shippingCents)}</span>
              </div>
              {shippingCents > 0 && (
                <p className="text-xs text-steel">
                  Frete grátis em compras acima de {formatBRL(FREE_SHIPPING_THRESHOLD_CENTS)}.
                </p>
              )}
            </div>
            <div className="mt-4 flex justify-between border-t border-fog pt-4 font-display text-lg font-medium text-ink">
              <span>Total</span>
              <span>{formatBRL(totalCents)}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-aero py-3 text-sm font-medium text-cloud transition-opacity hover:opacity-90"
            >
              <MessageCircle size={16} />
              Finalizar compra pelo WhatsApp
            </button>
            <p className="mt-3 text-center text-xs text-steel">
              Você será direcionado ao WhatsApp para combinar pagamento e entrega com nossa equipe.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
