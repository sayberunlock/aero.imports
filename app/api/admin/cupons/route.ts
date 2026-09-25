import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const couponSchema = z.object({
  code: z.string().min(3).max(30).toUpperCase(),
  percentOff: z.number().int().min(1).max(100).nullable().optional(),
  amountOffCents: z.number().int().min(1).nullable().optional(),
  minOrderCents: z.number().int().min(0).nullable().optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  expiresAt: z.string().nullable().optional(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  if (!parsed.data.percentOff && !parsed.data.amountOffCents) {
    return NextResponse.json({ message: "Informe desconto percentual ou em valor fixo." }, { status: 400 });
  }

  const existing = await db.coupon.findUnique({ where: { code: parsed.data.code } });
  if (existing) {
    return NextResponse.json({ message: "Já existe um cupom com este código." }, { status: 409 });
  }

  const coupon = await db.coupon.create({
    data: {
      code: parsed.data.code,
      percentOff: parsed.data.percentOff || null,
      amountOffCents: parsed.data.amountOffCents || null,
      minOrderCents: parsed.data.minOrderCents || null,
      maxUses: parsed.data.maxUses || null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });

  return NextResponse.json({ coupon }, { status: 201 });
}
