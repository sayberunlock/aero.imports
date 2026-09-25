import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <Link href="/admin/blog" className="mb-6 inline-flex items-center gap-2 text-sm text-steel hover:text-ink">
        <ArrowLeft size={16} />
        Voltar para Blog
      </Link>
      <h1 className="font-display text-2xl font-medium text-ink">Novo artigo</h1>
      <div className="mt-8">
        <BlogPostForm />
      </div>
    </div>
  );
}
