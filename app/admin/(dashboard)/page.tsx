import { Package, ShoppingCart, Users, MessageSquare } from "lucide-react";
import { db } from "@/lib/db";

// Todas as outras páginas do admin já usam isso (ver produtos/page.tsx,
// pedidos/page.tsx etc.) — sem essa linha, o Next.js entende que esta
// página não depende de nada dinâmico e a pré-renderiza uma vez no build,
// "congelando" os números no valor de quando o deploy foi feito, em vez de
// consultar o banco a cada visita.
export const dynamic = "force-dynamic";

/**
 * Antes desta correção, os 4 números do dashboard eram um placeholder fixo
 * ("—" no código, sem nenhuma consulta ao banco) e o aviso "conecte o banco
 * de dados / rode npm run db:seed" aparecia sempre, mesmo com produtos e
 * clientes reais já cadastrados. Agora cada número consulta o Postgres de
 * verdade. Se alguma consulta falhar (banco indisponível), ela cai em `null`
 * e mostra "—" só naquele card, sem quebrar o restante da página. O aviso de
 * "banco indisponível" só aparece se TODAS as consultas falharem — ou seja,
 * se o problema for de conexão de verdade, não só catálogo vazio.
 */

async function safeCount(fn: () => Promise<number>): Promise<number | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

function formatCount(value: number | null): string {
  return value === null ? "—" : value.toLocaleString("pt-BR");
}

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [ordersToday, activeProducts, customers, unreadMessages] = await Promise.all([
    safeCount(() => db.order.count({ where: { createdAt: { gte: startOfToday } } })),
    safeCount(() => db.product.count({ where: { isArchived: false } })),
    safeCount(() => db.user.count({ where: { role: "CUSTOMER" } })),
    safeCount(() => db.contactMessage.count({ where: { read: false } })),
  ]);

  const dbUnavailable = [ordersToday, activeProducts, customers, unreadMessages].every(
    (value) => value === null
  );

  const stats = [
    { label: "Pedidos hoje", value: formatCount(ordersToday), icon: ShoppingCart },
    { label: "Produtos ativos", value: formatCount(activeProducts), icon: Package },
    { label: "Clientes cadastrados", value: formatCount(customers), icon: Users },
    { label: "Mensagens não lidas", value: formatCount(unreadMessages), icon: MessageSquare },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-steel">
        Visão geral da loja, com os números atualizados direto do banco de
        dados.
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

      {dbUnavailable && (
        <div className="mt-10 rounded-2xl border border-dashed border-steel-light bg-cloud/60 p-8 text-center">
          <p className="text-sm text-steel">
            Não foi possível consultar o banco de dados agora. Confirme se a
            variável <code>DATABASE_URL</code> está correta e tente atualizar
            a página em alguns instantes.
          </p>
        </div>
      )}
    </div>
  );
}
