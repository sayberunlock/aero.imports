import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const postSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  authorName: z.string().min(2),
  category: z.string().optional(),
  published: z.boolean(),
});

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "SUPPORT")) return null;
  return session;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = postSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }

  const existing = await db.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ message: "Artigo não encontrado." }, { status: 404 });

  const becamePublished = parsed.data.published && !existing.published;

  const post = await db.blogPost.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      publishedAt: becamePublished ? new Date() : existing.publishedAt,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  await db.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
