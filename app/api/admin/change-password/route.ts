import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions, hashPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit("login", ip);
  if (!allowed) {
    return NextResponse.json({ message: "Muitas tentativas. Tente novamente em breve." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
  }

  const currentValid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!currentValid) {
    return NextResponse.json({ message: "Senha atual incorreta." }, { status: 400 });
  }

  const newHash = await hashPassword(parsed.data.newPassword);

  await db.user.update({
    where: { id: user.id },
    data: { passwordHash: newHash, mustChangePassword: false },
  });

  await db.auditLog.create({
    data: {
      userId: user.id,
      action: "CHANGE_PASSWORD",
      entity: "User",
      entityId: user.id,
      ip,
    },
  });

  return NextResponse.json({ ok: true });
}
