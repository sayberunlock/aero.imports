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

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existingSlug = await db.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existingSlug) {
    return NextResponse.json({ message: "Já existe um produto com esse slug." }, { status: 409 });
  }

  const { images, ...productData } = parsed.data;

  const product = await db.product.create({
    data: {
      ...productData,
      images:
        images && images.length > 0
          ? { create: images.map((url, position) => ({ url, position })) }
          : undefined,
    },
  });

  const actingUser = session.user?.email
    ? await db.user.findUnique({ where: { email: session.user.email } })
    : null;

  await db.auditLog.create({
    data: {
      userId: actingUser?.id ?? null,
      action: "CREATE",
      entity: "Product",
      entityId: product.id,
    },
  });

  return NextResponse.json({ product }, { status: 201 });
}
