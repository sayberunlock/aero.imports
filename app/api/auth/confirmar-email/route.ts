import { NextResponse } from "next/server";
import { confirmEmailSchema } from "@/lib/validation";
import { db } from "@/lib/db";
import { verifyCode } from "@/lib/verification-codes";
import { rateLimit } from "@/lib/rate-limit";

const REASON_MESSAGES: Record<string, string> = {
  NOT_FOUND: "Código inválido ou expirado. Solicite um novo código.",
  EXPIRED: "Esse código expirou. Solicite um novo código.",
  TOO_MANY_ATTEMPTS: "Muitas tentativas com este código. Solicite um novo código.",
  INVALID: "Código incorreto. Confira os 6 dígitos e tente novamente.",
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = confirmEmailSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { email, code } = parsed.data;

  const { allowed, retryAfterSeconds } = await rateLimit("codeVerify", email);
  if (!allowed) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds ?? 60) } }
    );
  }

  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "Código inválido ou expirado." }, { status: 400 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: "E-mail já confirmado." });
  }

  const result = await verifyCode(user.id, "SIGNUP", code);
  if (!result.ok) {
    return NextResponse.json({ message: REASON_MESSAGES[result.reason] }, { status: 400 });
  }

  await db.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } });

  return NextResponse.json({ message: "E-mail confirmado com sucesso." });
}
