import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Gauge, ShieldCheck, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Assistência Técnica",
  description: "Manutenção, calibração e suporte técnico especializado para drones, câmeras e estabilizadores DJI.",
};

const services = [
  {
    icon: Gauge,
    title: "Calibração e diagnóstico",
    text: "Verificação completa de sensores, motores e sistemas de voo, com relatório técnico detalhado.",
  },
  {
    icon: Wrench,
    title: "Reparo de componentes",
    text: "Substituição de peças originais — hélices, gimbal, baterias, cabos — por técnicos especializados em DJI.",
  },
  {
    icon: ShieldCheck,
    title: "Acionamento de garantia",
    text: "Cuidamos de todo o processo de garantia junto ao fabricante, sem burocracia para você.",
  },
];

export default function AssistenciaTecnicaPage() {
  return (
    <div className="mx-auto max-w-content px-6 pb-24 pt-32 lg:px-10">
      <Reveal>
        <p className="eyebrow-mono text-signal">Suporte Especializado</p>
        <h1 className="mt-3 max-w-2xl font-display text-display-md font-medium text-ink">
          Manutenção e suporte técnico para equipamentos DJI.
        </h1>
        <p className="mt-4 max-w-xl text-steel">
          Da calibração à reposição de peças originais, nossa equipe cuida do seu equipamento com a
          mesma precisão que ele exige em voo.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.1}>
            <div className="h-full rounded-2xl bg-cloud p-6 shadow-card">
              <service.icon size={22} className="text-signal" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-base font-medium text-ink">{service.title}</h3>
              <p className="mt-2 text-sm text-steel">{service.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.3} className="mt-14 rounded-2xl bg-ink p-8 text-center sm:p-12">
        <p className="mx-auto max-w-md text-cloud">
          Agende uma avaliação técnica ou tire dúvidas sobre o seu equipamento.
        </p>
        <Link
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-medium text-cloud transition-transform hover:scale-[1.03]"
        >
          <MessageCircle size={16} />
          Falar com um técnico
        </Link>
      </Reveal>
    </div>
  );
}
