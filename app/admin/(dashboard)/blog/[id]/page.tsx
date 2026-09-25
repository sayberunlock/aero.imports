import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await db.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-steel hover:text-ink">
        <ArrowLeft size={16} />
        Voltar para Blog
      </Link>
      <h1 className="font-display text-2xl font-medium text-ink">Editar artigo</h1>
      <div className="mt-8">
        <BlogPostForm
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt ?? "",
            content: post.content,
            coverImage: post.coverImage ?? "",
            authorName: post.authorName,
            category: post.category ?? "",
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
