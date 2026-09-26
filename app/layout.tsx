import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Providers } from "@/components/Providers";
import { siteConfig } from "@/lib/site-config";
import { getSiteConfig } from "@/lib/site-config-server";
import { IntroOverlay } from "@/components/ui/IntroOverlay";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B0F14",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${config.name} | Loja Autorizada DJI — Drones, Câmeras e Estabilizadores`,
      template: `%s | ${config.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "DJI",
      "drones profissionais",
      "câmeras",
      "estabilizadores",
      "gimbal",
      "microfones sem fio",
      "loja autorizada DJI",
      "Aero Imports",
    ],
    authors: [{ name: config.name }],
    creator: config.name,
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: siteConfig.url,
      siteName: config.name,
      title: `${config.name} | Loja Autorizada DJI`,
      description: siteConfig.description,
      images: [{ url: "/images/og-cover.svg", width: 1200, height: 630, alt: config.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: config.name,
      description: siteConfig.description,
      images: ["/images/og-cover.svg"],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.svg`,
    sameAs: [siteConfig.social.instagram],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: config.email,
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };

  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>
          <SiteChrome
            intro={<IntroOverlay siteName={config.name} />}
            footer={<Footer />}
            whatsapp={<WhatsAppButton whatsappNumber={config.whatsapp} />}
          >
            {children}
          </SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
