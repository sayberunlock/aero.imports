import { db } from "@/lib/db";
import { VideoManager } from "@/components/admin/VideoManager";

export const dynamic = "force-dynamic";

export default async function AdminVideosPage() {
  const videos = await db.siteVideo.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Vídeos institucionais</h1>
      <p className="mt-1 text-sm text-steel">
        Cadastre vídeos que aparecerão automaticamente na Home e em outras páginas do site.
      </p>

      <div className="mt-8">
        <VideoManager
          videos={videos.map((v) => ({
            id: v.id,
            title: v.title,
            placement: v.placement,
            url: v.url,
            active: v.active,
          }))}
        />
      </div>
    </div>
  );
}
