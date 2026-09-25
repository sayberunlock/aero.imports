import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type Props = { params: { slug: string } };

async function getPost(slug: string) {
  return db.blogPost.findFirst({ where: { slug, published: true } }).catch(() => null);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 pb-24 pt-32 lg:px-10">
      {post.category && <p className="eyebrow-mono text-signal">{post.category}</p>}
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">{post.title}</h1>
      <p className="mt-2 text-sm text-steel">
        Por {post.authorName}
        {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString("pt-BR")}`}
      </p>

      {post.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl bg-fog">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-slate mt-10 max-w-none whitespace-pre-line text-steel">
        {post.content}
      </div>
    </article>
  );
}
