import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";

const stats = [
  { label: "Pedidos hoje", value: "—", icon: ShoppingCart },
  { label: "Produtos ativos", value: "—", icon: Package },
  { label: "Clientes cadastrados", value: "—", icon: Users },
  { label: "Mensagens não lidas", value: "—", icon: MessageSquare },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-steel">
        Visão geral da loja. Os números serão preenchidos automaticamente
        conforme os pedidos e cadastros entram no sistema.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-cloud p-6 shadow-card">
            <s.icon size={20} className="text-signal" strokeWidth={1.6} />
            <p className="mt-4 font-display text-2xl font-medium text-ink">{s.value}</p>
            <p className="mt-1 text-sm text-steel">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-steel-light bg-cloud/60 p-8 text-center">
        <p className="text-sm text-steel">
          Conecte o banco de dados (`DATABASE_URL` no `.env`) e rode
          `npm run db:seed` para popular o catálogo inicial. Os módulos de
          Produtos, Pedidos, Clientes e Cupons ficam disponíveis no menu
          lateral assim que os dados existirem.
        </p>
      </div>
    </div>
  );
}
