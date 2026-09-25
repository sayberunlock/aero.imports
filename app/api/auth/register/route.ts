import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados inválidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password, phone } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ message: "Já existe uma conta com este e-mail." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await db.user.create({
    data: { name, email, passwordHash, phone, role: "CUSTOMER" },
  });

  return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 });
}
