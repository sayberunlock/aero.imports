import { formatBRL } from "@/lib/utils";

/**
 * Checkout via WhatsApp (decisão de produto — Opção A, confirmada em sessão).
 *
 * A partir desta sessão, finalizar compra NÃO cria mais um `Order` no banco
 * a partir do carrinho público. Em vez disso, montamos uma mensagem
 * pré-formatada e abrimos o WhatsApp para o atendimento fechar a venda por
 * conversa direta (Pix, cartão, boleto combinados manualmente — não há
 * gateway de pagamento integrado ao site).
 *
 * O model `Order`, a rota `/api/pedidos` e o painel `/admin/pedidos`
 * continuam existindo para uso futuro do admin (ex.: registrar manualmente
 * um pedido fechado por WhatsApp), mas não são chamados neste fluxo.
 */

export type WhatsAppOrderItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
};

/** Uma linha do pedido no formato acordado: "1x Produto — R$ 00,00". */
function formatOrderLine(item: WhatsAppOrderItem): string {
  const unit = formatBRL(item.unitPriceCents);
  if (item.quantity <= 1) {
    return `1x ${item.name} — ${unit}`;
  }
  const lineTotal = formatBRL(item.unitPriceCents * item.quantity);
  return `${item.quantity}x ${item.name} — ${unit} (x${item.quantity} = ${lineTotal})`;
}

/**
 * Monta a mensagem de finalização de pedido (carrinho inteiro ou um único
 * produto no fluxo de "comprar agora").
 *
 * `customerName` só é incluído se houver um cliente logado — se for
 * `null`/`undefined`/string vazia, a linha "Nome:" é omitida por completo.
 */
export function buildOrderWhatsAppMessage(
  items: WhatsAppOrderItem[],
  customerName?: string | null
): string {
  const totalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

  const lines = [
    "Olá! Gostaria de finalizar este pedido na Aero Imports:",
    "",
    ...items.map(formatOrderLine),
    "",
    `Total: ${formatBRL(totalCents)}`,
  ];

  if (customerName && customerName.trim().length > 0) {
    lines.push("", `Nome: ${customerName.trim()}`);
  }

  return lines.join("\n");
}

/** Monta a URL final `https://wa.me/<numero>?text=<mensagem>` já codificada. */
export function buildWhatsAppUrl(whatsappNumber: string, message: string): string {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
