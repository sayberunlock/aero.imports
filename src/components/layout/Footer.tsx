import Link from "next/link";
import { Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";
import { siteConfig, mainCategories } from "@/lib/site-config";
import { getSiteConfig } from "@/lib/site-config-server";

export async function Footer() {
  const year = new Date().getFullYear();
  const config = await getSiteConfig();
  const enderecoExibido = config.addressText || `${siteConfig.address.city}, ${siteConfig.address.state} — Brasil`;

  return (
    <footer className="bg-ink text-cloud">
      <div className="mx-auto grid max-w-content gap-12 px-6 py-16 lg:grid-cols-4 lg:px-10 lg:py-24">
        <div>
          <p className="font-display text-lg font-medium">
            AERO<span className="text-signal">IMPORTS</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-steel-light text-steel">
            Loja autorizada DJI. Produtos originais, nota fiscal e suporte
            especializado para quem exige precisão.
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href={config.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Aero Imports"
              className="text-steel transition-colors hover:text-signal"
            >
              <Instagram size={20} strokeWidth={1.6} />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow-mono text-steel">Categorias</p>
          <ul className="mt-4 space-y-2 text-sm">
            {mainCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="text-cloud/85 transition-colors hover:text-signal">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow-mono text-steel">Institucional</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/empresa" className="text-cloud/85 hover:text-signal">Empresa</Link></li>
            <li><Link href="/assistencia-tecnica" className="text-cloud/85 hover:text-signal">Assistência Técnica</Link></li>
            <li><Link href="/garantia" className="text-cloud/85 hover:text-signal">Garantia</Link></li>
            <li><Link href="/faq" className="text-cloud/85 hover:text-signal">Perguntas Frequentes</Link></li>
            <li><Link href="/politica-de-privacidade" className="text-cloud/85 hover:text-signal">Política de Privacidade</Link></li>
            <li><Link href="/termos-de-uso" className="text-cloud/85 hover:text-signal">Termos de Uso</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow-mono text-steel">Contato</p>
          <ul className="mt-4 space-y-3 text-sm text-cloud/85">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-signal" />
              {enderecoExibido}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-signal" />
              {siteConfig.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-signal" />
              {config.email}
            </li>
            <li className="flex items-center gap-2">
              <Clock size={16} className="shrink-0 text-signal" />
              {siteConfig.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-steel lg:flex-row lg:px-10">
          <p>© {year} Aero Imports. Todos os direitos reservados.</p>
          <p>CNPJ a definir · Site em conformidade com a LGPD</p>
        </div>
      </div>
    </footer>
  );
}
