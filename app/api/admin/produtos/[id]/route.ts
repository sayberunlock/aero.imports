import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) {
    return null;
  }
  return session;
}

async function resolveUserId(email?: string | null) {
  if (!email) return null;
  const user = await db.user.findUnique({ where: { email } });
  return user?.id ?? null;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const product = await db.product.findUnique({
    where: { id: params.id },
    include: { category: true, images: true },
  });

  if (!product) {
    return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await db.product.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
  }

  if (parsed.data.slug && parsed.data.slug !== existing.slug) {
    const slugTaken = await db.product.findUnique({ where: { slug: parsed.data.slug } });
    if (slugTaken) {
      return NextResponse.json({ message: "Já existe um produto com esse slug." }, { status: 409 });
    }
  }

  const product = await db.product.update({ where: { id: params.id }, data: parsed.data });

  await db.auditLog.create({
    data: {
      userId: await resolveUserId(session.user?.email),
      action: "UPDATE",
      entity: "Product",
      entityId: product.id,
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const existing = await db.product.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ message: "Produto não encontrado." }, { status: 404 });
  }

  await db.product.delete({ where: { id: params.id } });

  await db.auditLog.create({
    data: {
      userId: await resolveUserId(session.user?.email),
      action: "DELETE",
      entity: "Product",
      entityId: params.id,
    },
  });

  return NextResponse.json({ ok: true });
}
