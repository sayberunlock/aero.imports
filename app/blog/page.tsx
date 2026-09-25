import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description: "Dicas, novidades e conteúdo sobre drones, câmeras e produção audiovisual da Aero Imports.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await db.blogPost
    .findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <Reveal>
        <p className="eyebrow-mono text-signal">Conteúdo</p>
        <h1 className="mt-3 font-display text-display-md font-medium text-ink">Blog</h1>
        <p className="mt-2 text-sm text-steel">Dicas, lançamentos e guias sobre o universo DJI.</p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-steel-light bg-fog/60 px-6 py-16 text-center text-sm text-steel">
          Nenhum artigo publicado ainda. Em breve, novidades por aqui.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl bg-cloud shadow-card transition-shadow hover:shadow-elevate"
            >
              {post.coverImage && (
                <div className="relative aspect-video overflow-hidden bg-fog">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                {post.category && <p className="eyebrow-mono text-signal">{post.category}</p>}
                <h2 className="mt-2 font-display text-lg font-medium text-ink">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-steel">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
