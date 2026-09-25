import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsersManager } from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUsuariosPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  if (role !== "ADMIN") {
    redirect("/admin");
  }

  const users = await db.user.findMany({
    where: { role: { in: ["ADMIN", "SUPPORT"] } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Usuários do painel</h1>
      <p className="mt-1 text-sm text-steel">
        Gerencie quem tem acesso ao painel administrativo. Apenas administradores podem criar novos usuários.
      </p>

      <div className="mt-8">
        <UsersManager
          users={users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            createdAt: u.createdAt.toISOString(),
          }))}
        />
      </div>
    </div>
  );
}
