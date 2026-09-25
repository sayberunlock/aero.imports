import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  imageUrl: z.string().url(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  position: z.number().int().min(0).default(0),
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
  const banners = await db.banner.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ banners });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = bannerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const banner = await db.banner.create({ data: parsed.data });
  return NextResponse.json({ banner }, { status: 201 });
}
