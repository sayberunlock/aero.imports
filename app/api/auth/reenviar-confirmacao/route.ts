import { NextResponse } from "next/server";
import { emailSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { createVerificationCode } from "@/lib/verification-codes";
import { sendMail, verificationCodeEmailHtml } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Informe um e-mail válido." }, { status: 400 });
  }

  const { email } = parsed.data;

  const { allowed, retryAfterSeconds } = await rateLimit("emailCode", email);
  if (!allowed) {
    return NextResponse.json(
      { message: "Você já pediu um novo código recentemente. Aguarde alguns minutos e tente de novo." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds ?? 60) } }
    );
  }

  // Resposta idêntica em qualquer caso, para não revelar se o e-mail existe
  // ou já está confirmado.
  const genericResponse = NextResponse.json({
    message: "Se houver um cadastro pendente de confirmação para este e-mail, um novo código foi enviado.",
  });

  const user = await db.user.findUnique({ where: { email } });
  if (!user || user.emailVerified) return genericResponse;

  const code = await createVerificationCode(user.id, "SIGNUP");

  try {
    await sendMail({
      to: user.email,
      subject: "Seu novo código de confirmação — Aero Imports",
      html: verificationCodeEmailHtml({
        heading: "Confirme seu e-mail",
        intro: `Olá, ${user.name}! Aqui está seu novo código para confirmar seu e-mail na Aero Imports.`,
        code,
        footerNote: "Esse código é válido por 15 minutos.",
      }),
      text: `Seu código de confirmação Aero Imports: ${code} (válido por 15 minutos).`,
    });
  } catch (err) {
    console.error("[reenviar-confirmacao] Falha ao enviar e-mail:", err);
  }

  return genericResponse;
}
