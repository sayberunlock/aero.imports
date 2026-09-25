import { NextResponse } from "next/server";
import DOMPurify from "isomorphic-dompurify";
import { db } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, retryAfterSeconds } = await rateLimit("contact", ip);
  if (!allowed) {
    return NextResponse.json(
      { message: "Muitas mensagens enviadas. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds ?? 60) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const clean = {
    name: DOMPurify.sanitize(parsed.data.name),
    email: parsed.data.email,
    phone: parsed.data.phone ? DOMPurify.sanitize(parsed.data.phone) : undefined,
    subject: parsed.data.subject ? DOMPurify.sanitize(parsed.data.subject) : undefined,
    message: DOMPurify.sanitize(parsed.data.message),
  };

  await db.contactMessage.create({ data: clean });

  return NextResponse.json({ ok: true });
}
