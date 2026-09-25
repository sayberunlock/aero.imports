import { DatabaseBackup } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminBackupPage() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Backup</h1>
      <p className="mt-1 max-w-xl text-sm text-steel">
        Backups reais de banco de dados são feitos na infraestrutura (ex.: snapshots automáticos do
        provedor Postgres), não por um botão nesta tela — um botão de &ldquo;gerar backup&rdquo; aqui criaria uma
        falsa sensação de segurança sem garantir a integridade dos dados. Recomendamos configurar
        snapshots diários no seu provedor de banco de dados (Neon, Supabase, RDS, etc.).
      </p>

      <h2 className="mt-10 font-display text-lg font-medium text-ink">Log de auditoria recente</h2>
      <div className="mt-4 overflow-hidden rounded-2xl bg-cloud shadow-card">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-steel">
            <DatabaseBackup size={28} />
            <p className="text-sm">Nenhuma ação registrada ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-fog text-xs uppercase tracking-wide text-steel">
                <tr>
                  <th className="px-6 py-3 font-medium">Ação</th>
                  <th className="px-6 py-3 font-medium">Entidade</th>
                  <th className="px-6 py-3 font-medium">Usuário</th>
                  <th className="px-6 py-3 font-medium">Quando</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-fog last:border-0">
                    <td className="px-6 py-3 text-ink">{log.action}</td>
                    <td className="px-6 py-3 text-steel">{log.entity}</td>
                    <td className="px-6 py-3 text-steel">{log.user?.name ?? "—"}</td>
                    <td className="px-6 py-3 text-steel">{new Date(log.createdAt).toLocaleString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
