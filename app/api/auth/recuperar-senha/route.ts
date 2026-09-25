import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";

const requestSchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Informe um e-mail válido." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });

  // Resposta idêntica exista ou não o e-mail, para não vazar quais e-mails
  // estão cadastrados (enumeração de contas).
  const genericResponse = NextResponse.json({
    message: "Se este e-mail estiver cadastrado, você receberá um link de redefinição em instantes.",
  });

  if (!user) return genericResponse;

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1h

  await db.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  // TODO: enviar e-mail transacional real via SMTP (ver variáveis SMTP_* no
  // .env). Sem provedor de e-mail configurado neste ambiente, registramos o
  // link no log do servidor para permitir testes manuais em desenvolvimento.
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/conta/redefinir-senha?token=${token}`;
  console.info(`[reset-senha] Link de redefinição para ${user.email}: ${resetUrl}`);

  return genericResponse;
}
