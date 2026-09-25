import crypto from "crypto";
import { db } from "@/lib/db";

export type VerificationPurpose = "SIGNUP" | "RESET_PASSWORD";

const CODE_TTL_MINUTES = 15;
const MAX_ATTEMPTS = 5;

function generateSixDigitCode(): string {
  // crypto.randomInt é criptograficamente seguro (ao contrário de Math.random)
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

function hashCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

/**
 * Cria um novo código de 6 dígitos para o usuário e finalidade informados,
 * invalidando qualquer código anterior não usado da mesma finalidade (assim
 * só o código mais recente enviado por e-mail funciona).
 */
export async function createVerificationCode(
  userId: string,
  purpose: VerificationPurpose
): Promise<string> {
  const code = generateSixDigitCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

  await db.verificationCode.updateMany({
    where: { userId, purpose, consumedAt: null },
    data: { consumedAt: new Date() },
  });

  await db.verificationCode.create({
    data: { userId, codeHash, purpose, expiresAt },
  });

  return code;
}

export type VerifyCodeResult =
  | { ok: true }
  | { ok: false; reason: "NOT_FOUND" | "EXPIRED" | "TOO_MANY_ATTEMPTS" | "INVALID" };

/**
 * Confirma um código digitado pelo usuário. Consome uma tentativa a cada
 * chamada com código errado; após MAX_ATTEMPTS o código fica bloqueado e é
 * preciso solicitar um novo.
 */
export async function verifyCode(
  userId: string,
  purpose: VerificationPurpose,
  code: string
): Promise<VerifyCodeResult> {
  const record = await db.verificationCode.findFirst({
    where: { userId, purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) return { ok: false, reason: "NOT_FOUND" };
  if (record.expiresAt < new Date()) return { ok: false, reason: "EXPIRED" };
  if (record.attempts >= MAX_ATTEMPTS) return { ok: false, reason: "TOO_MANY_ATTEMPTS" };

  if (hashCode(code) !== record.codeHash) {
    await db.verificationCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    return { ok: false, reason: "INVALID" };
  }

  await db.verificationCode.update({
    where: { id: record.id },
    data: { consumedAt: new Date() },
  });

  return { ok: true };
}
