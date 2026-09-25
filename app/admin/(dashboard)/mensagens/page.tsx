import { MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { MarkAsReadButton } from "@/components/admin/MarkAsReadButton";

export const dynamic = "force-dynamic";

export default async function AdminMensagensPage() {
  const messages = await db.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <h1 className="font-display text-2xl font-medium text-ink">Mensagens</h1>
      <p className="mt-1 text-sm text-steel">
        {messages.length} mensagem(ns) recebida(s) pelo formulário de contato
        {unread > 0 && ` — ${unread} não lida(s)`}.
      </p>

      <div className="mt-8 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-cloud px-6 py-16 text-center text-steel shadow-card">
            <MessageSquare size={28} />
            <p className="text-sm">Nenhuma mensagem recebida ainda.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="rounded-2xl bg-cloud p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink">
                    {m.name} {!m.read && <span className="ml-2 rounded-full bg-signal/10 px-2 py-0.5 text-xs text-signal">Nova</span>}
                  </p>
                  <p className="text-xs text-steel">
                    {m.email} {m.phone && `· ${m.phone}`} · {new Date(m.createdAt).toLocaleString("pt-BR")}
                  </p>
                </div>
                {!m.read && <MarkAsReadButton id={m.id} />}
              </div>
              {m.subject && <p className="mt-3 text-sm font-medium text-ink">{m.subject}</p>}
              <p className="mt-1 text-sm text-steel">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
