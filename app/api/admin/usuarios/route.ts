import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import crypto from "crypto";
import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["ADMIN", "SUPPORT"]),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || role !== "ADMIN") return null; // só ADMIN pode gerenciar usuários
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const users = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPPORT"] } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ users });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = staffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ message: "Já existe uma conta com este e-mail." }, { status: 409 });
  }

  // Gera uma senha temporária aleatória; o usuário é forçado a trocá-la no
  // primeiro acesso (mustChangePassword).
  const tempPassword = crypto.randomBytes(9).toString("base64url");
  const passwordHash = await hashPassword(tempPassword);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash,
      mustChangePassword: true,
    },
  });

  return NextResponse.json({ user: { id: user.id, email: user.email }, tempPassword }, { status: 201 });
}
