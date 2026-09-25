import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const videoSchema = z.object({
  title: z.string().min(2),
  placement: z.string().min(2),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
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
  const videos = await db.siteVideo.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ videos });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const video = await db.siteVideo.create({
    data: { ...parsed.data, thumbnailUrl: parsed.data.thumbnailUrl || null },
  });
  return NextResponse.json({ video }, { status: 201 });
}
