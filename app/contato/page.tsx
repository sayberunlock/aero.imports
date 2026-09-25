import type { Metadata } from "next";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a Aero Imports por WhatsApp, telefone, e-mail ou formulário. Estamos à disposição para sua compra ou suporte técnico.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <p className="eyebrow-mono text-signal">Contato</p>
      <h1 className="mt-3 font-display text-display-md font-medium text-ink">Vamos conversar.</h1>

      <div className="mt-12 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <ContactForm />
        </div>

        <div className="space-y-6">
          <InfoRow icon={Phone} label="Telefone / WhatsApp" value={siteConfig.phone} />
          <InfoRow icon={Mail} label="E-mail" value={siteConfig.email} />
          <InfoRow icon={Clock} label="Horário de atendimento" value={siteConfig.hours} />
          <InfoRow
            icon={MapPin}
            label="Localização"
            value={`${siteConfig.address.city}, ${siteConfig.address.state} — Brasil`}
          />

          <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-fog">
            <iframe
              title="Mapa da localização da Aero Imports"
              className="h-full w-full"
              loading="lazy"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${siteConfig.address.street}, ${siteConfig.address.city} - ${siteConfig.address.state}`
              )}&output=embed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="mt-0.5 shrink-0 text-signal" strokeWidth={1.6} />
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-steel">{label}</p>
        <p className="text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}
