import { db } from "@/lib/db";
import { BannerManager } from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Banners</h1>
      <p className="mt-1 text-sm text-steel">Gerencie os banners exibidos na Home e em outras páginas.</p>

      <div className="mt-8">
        <BannerManager
          banners={banners.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle,
            imageUrl: b.imageUrl,
            ctaLabel: b.ctaLabel,
            ctaUrl: b.ctaUrl,
            active: b.active,
          }))}
        />
      </div>
    </div>
  );
}
