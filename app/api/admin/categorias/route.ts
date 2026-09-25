import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const categorySchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  description: z.string().max(500).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  parentId: z.string().cuid().nullable().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existingSlug = await db.category.findUnique({ where: { slug: parsed.data.slug } });
  if (existingSlug) {
    return NextResponse.json({ message: "Já existe uma categoria com esse slug." }, { status: 409 });
  }

  const category = await db.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      imageUrl: parsed.data.imageUrl || null,
      parentId: parsed.data.parentId || null,
    },
  });

  return NextResponse.json({ category }, { status: 201 });
}
