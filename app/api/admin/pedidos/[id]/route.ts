import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const statusSchema = z.object({
  status: z.enum(["AGUARDANDO_PAGAMENTO", "PAGO", "EM_SEPARACAO", "ENVIADO", "ENTREGUE", "CANCELADO", "REEMBOLSADO"]),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Status inválido." }, { status: 400 });
  }

  const order = await db.order.update({ where: { id: params.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ order });
}
