import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { createVerificationCode } from "@/lib/verification-codes";
import { sendMail, verificationCodeEmailHtml } from "@/lib/mail";

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

  const code = await createVerificationCode(user.id, "SIGNUP");

  try {
    await sendMail({
      to: user.email,
      subject: "Confirme seu e-mail — Aero Imports",
      html: verificationCodeEmailHtml({
        heading: "Confirme seu e-mail",
        intro: `Olá, ${user.name}! Use o código abaixo para confirmar seu e-mail e ativar sua conta na Aero Imports.`,
        code,
        footerNote: "Esse código é válido por 15 minutos.",
      }),
      text: `Seu código de confirmação Aero Imports: ${code} (válido por 15 minutos).`,
    });
  } catch (err) {
    // Conta já foi criada; se o e-mail falhar (ex.: SMTP ainda não
    // configurado), o cliente pode pedir um novo código depois em
    // /conta/confirmar-email — não desfazemos o cadastro por causa disso.
    console.error("[register] Falha ao enviar e-mail de confirmação:", err);
  }

  return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 });
}
