import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const settingsSchema = z.record(z.string(), z.string());

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  const settings = await db.siteSetting.findMany();
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  await db.$transaction(
    Object.entries(parsed.data).map(([key, value]) =>
      db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );

  return NextResponse.json({ ok: true });
}
