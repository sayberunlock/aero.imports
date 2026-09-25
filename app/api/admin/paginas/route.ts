import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const pageSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  title: z.string().min(2),
  content: z.string().min(1),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  const pages = await db.page.findMany({ orderBy: { slug: "asc" } });
  return NextResponse.json({ pages });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const existing = await db.page.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ message: "Já existe uma página com este slug." }, { status: 409 });
  }

  const page = await db.page.create({ data: parsed.data });
  return NextResponse.json({ page }, { status: 201 });
}
