import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const confirmSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = confirmSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const resetToken = await db.passwordResetToken.findUnique({ where: { token: parsed.data.token } });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ message: "Link de redefinição inválido ou expirado." }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.$transaction([
    db.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    db.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  return NextResponse.json({ message: "Senha redefinida com sucesso." });
}
