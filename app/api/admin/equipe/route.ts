import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const memberSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(2),
  photoUrl: z.string().url().optional().or(z.literal("")),
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
  const members = await db.teamMember.findMany({ orderBy: { position: "asc" } });
  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = memberSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });

  const member = await db.teamMember.create({
    data: { ...parsed.data, photoUrl: parsed.data.photoUrl || null },
  });
  return NextResponse.json({ member }, { status: 201 });
}
