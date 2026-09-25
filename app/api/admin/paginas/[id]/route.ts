import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.string().min(1).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
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
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });

  const page = await db.page.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ page });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  await db.page.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
