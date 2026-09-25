import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) {
    return null;
  }
  return session;
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const inUse = await db.product.count({ where: { categoryId: params.id } });
  if (inUse > 0) {
    return NextResponse.json(
      { message: `Não é possível excluir: ${inUse} produto(s) usam esta categoria.` },
      { status: 409 }
    );
  }

  await db.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
