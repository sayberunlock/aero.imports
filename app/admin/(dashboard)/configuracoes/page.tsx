import { db } from "@/lib/db";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

const FIELDS = [
  { key: "site.name", label: "Nome do site" },
  { key: "site.whatsapp", label: "WhatsApp (só números, com DDI)", hint: "Ex.: 5541999999999" },
  { key: "site.email", label: "E-mail de contato" },
  { key: "site.address", label: "Endereço", multiline: true },
  {
    key: "site.maintenanceMode",
    label: "Modo manutenção",
    type: "switch" as const,
    hint: "Quando ligado, os visitantes veem uma tela de \"Voltamos já\" em vez do site. O painel /admin continua acessível normalmente. Pode levar até ~15 segundos pra valer depois de salvar.",
  },
];

export default async function AdminConfiguracoesPage() {
  const settings = await db.siteSetting.findMany();
  const values = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Configurações</h1>
      <p className="mt-1 text-sm text-steel">Dados gerais do site.</p>
      <div className="mt-4 max-w-xl rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
        Estes valores já substituem automaticamente os padrões de{" "}
        <code className="font-mono">src/lib/site-config.ts</code> no site público (rodapé, metadados e
        botão de WhatsApp) sempre que preenchidos aqui. Deixe um campo vazio para usar o valor padrão.
      </div>

      <div className="mt-8">
        <SettingsForm fields={FIELDS} values={values} />
      </div>
    </div>
  );
}
