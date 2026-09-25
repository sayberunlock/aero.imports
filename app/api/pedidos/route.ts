import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Decisão de produto (Opção A, confirmada em sessão — ver src/lib/whatsapp.ts):
 * o carrinho público (/carrinho) não chama mais esta rota. O fechamento da
 * venda passou a acontecer via WhatsApp, sem gateway de pagamento integrado
 * ao site. Esta rota continua existindo para uso futuro do admin (ex.:
 * registrar manualmente um pedido fechado por WhatsApp em /admin/pedidos),
 * mas hoje não é chamada por nenhum fluxo do site.
 */

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string(),
        quantity: z.number().int().positive(),
        unitPriceCents: z.number().int().nonnegative(),
      })
    )
    .min(1, "O carrinho está vazio."),
});

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `AI-${year}-${random}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "É necessário estar logado para finalizar a compra." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Carrinho inválido." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
  }

  // O catálogo público (sample-data.ts) ainda não está ligado ao banco de
  // produtos real usado pelo admin. Tentamos casar cada item do carrinho
  // por slug; itens sem produto correspondente no banco são avisados aqui
  // em vez de gerar um pedido inconsistente.
  const dbProducts = await db.product.findMany({ where: { slug: { in: parsed.data.items.map((i) => i.slug) } } });
  const bySlug = new Map(dbProducts.map((p) => [p.slug, p]));

  const missing = parsed.data.items.filter((i) => !bySlug.has(i.slug));
  if (missing.length > 0) {
    return NextResponse.json(
      {
        message:
          "Alguns itens do carrinho ainda não existem no catálogo cadastrado no painel administrativo e não puderam ser reservados. Cadastre esses produtos em /admin/produtos primeiro.",
        missingSlugs: missing.map((m) => m.slug),
      },
      { status: 409 }
    );
  }

  const subtotalCents = parsed.data.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const shippingCents = subtotalCents >= 500000 ? 0 : 4990;

  const order = await db.order.create({
    data: {
      number: generateOrderNumber(),
      userId: user.id,
      subtotalCents,
      shippingCents,
      totalCents: subtotalCents + shippingCents,
      shippingAddress: JSON.stringify({}), // TODO: preencher endereço real quando o admin registrar o pedido manualmente
      items: {
        create: parsed.data.items.map((i) => ({
          productId: bySlug.get(i.slug)!.id,
          quantity: i.quantity,
          unitPriceCents: i.unitPriceCents,
        })),
      },
    },
  });

  return NextResponse.json({ order: { id: order.id, number: order.number } }, { status: 201 });
}
