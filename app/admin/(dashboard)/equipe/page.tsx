import { db } from "@/lib/db";
import { TeamManager } from "@/components/admin/TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminEquipePage() {
  const members = await db.teamMember.findMany({ orderBy: { position: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Equipe</h1>
      <p className="mt-1 text-sm text-steel">Gerencie os integrantes exibidos na página Empresa.</p>

      <div className="mt-8">
        <TeamManager members={members.map((m) => ({ id: m.id, name: m.name, role: m.role, photoUrl: m.photoUrl }))} />
      </div>
    </div>
  );
}
