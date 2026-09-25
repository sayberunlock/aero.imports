import { db } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

const FIELDS = [
  { key: "seo.defaultTitle", label: "Título padrão (meta title)" },
  { key: "seo.defaultDescription", label: "Descrição padrão (meta description)", multiline: true },
  { key: "seo.googleVerification", label: "Código de verificação Google Search Console" },
  { key: "seo.googleAnalyticsId", label: "ID do Google Analytics (GA4)" },
];

export default async function AdminSeoPage() {
  const settings = await db.siteSetting.findMany();
  const values = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">SEO</h1>
      <p className="mt-1 text-sm text-steel">Configurações de SEO e analytics do site.</p>

      <div className="mt-8">
        <SettingsForm fields={FIELDS} values={values} />
      </div>
    </div>
  );
}
