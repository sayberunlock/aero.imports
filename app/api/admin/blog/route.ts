import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const postSchema = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens"),
  excerpt: z.string().optional(),
  content: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  authorName: z.string().min(2),
  category: z.string().optional(),
  published: z.boolean().default(false),
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
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const existing = await db.blogPost.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ message: "Já existe um artigo com esse slug." }, { status: 409 });
  }

  const post = await db.blogPost.create({
    data: {
      ...parsed.data,
      coverImage: parsed.data.coverImage || null,
      publishedAt: parsed.data.published ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
