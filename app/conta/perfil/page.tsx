import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Heart, MapPin } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "@/components/conta/LogoutButton";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/conta/login?callbackUrl=/conta/perfil");
  }

  const user = await db.user.findUnique({
    where: { email: session.user!.email! },
    include: { orders: { orderBy: { createdAt: "desc" }, take: 5 } },
  });

  if (!user) {
    redirect("/conta/login?callbackUrl=/conta/perfil");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32">
      <p className="eyebrow-mono text-signal">Sua conta</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Olá, {user!.name.split(" ")[0]}</h1>
      <p className="mt-1 text-sm text-steel">{user!.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/carrinho" className="rounded-2xl bg-cloud p-5 shadow-card transition-shadow hover:shadow-elevate">
          <Package size={20} className="text-signal" />
          <p className="mt-3 text-sm font-medium text-ink">Meus pedidos</p>
          <p className="text-xs text-steel">{user!.orders.length} recente(s)</p>
        </Link>
        <Link href="/favoritos" className="rounded-2xl bg-cloud p-5 shadow-card transition-shadow hover:shadow-elevate">
          <Heart size={20} className="text-signal" />
          <p className="mt-3 text-sm font-medium text-ink">Favoritos</p>
          <p className="text-xs text-steel">Ver produtos salvos</p>
        </Link>
        <div className="rounded-2xl bg-cloud p-5 shadow-card">
          <MapPin size={20} className="text-signal" />
          <p className="mt-3 text-sm font-medium text-ink">Endereços</p>
          <p className="text-xs text-steel">Gerenciado no checkout</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-cloud p-6 shadow-card">
        <h2 className="font-display text-lg font-medium text-ink">Pedidos recentes</h2>
        {user!.orders.length === 0 ? (
          <p className="mt-3 text-sm text-steel">Você ainda não fez nenhum pedido.</p>
        ) : (
          <ul className="mt-4 divide-y divide-fog">
            {user!.orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink">{order.number}</span>
                <span className="text-steel">{order.status.replace(/_/g, " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <LogoutButton />
      </div>
    </div>
  );
}
