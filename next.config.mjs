/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// Em desenvolvimento, o Next.js (webpack) usa eval() para rodar os módulos
// com source map e para o Fast Refresh/HMR via WebSocket. Uma CSP sem
// 'unsafe-eval' e sem liberar ws: quebra a execução do JS no `next dev` —
// o efeito prático é que NADA que dependa de JS funciona: os cards com
// animação (Framer Motion `whileInView`, usados nas fotos de categoria,
// produtos em destaque e vídeos da home) ficam parados em opacity: 0
// pra sempre, os vídeos não iniciam o autoplay, favoritos/carrinho não
// respondem, etc. Isso é o que estava fazendo parecer que "fotos e
// vídeos não aparecem". Em produção (`next build && next start`) o bundle
// não usa eval(), então mantemos a CSP restrita normalmente.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://upload-widget.cloudinary.com"
  : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://upload-widget.cloudinary.com";

const connectSrc = isDev
  ? "connect-src 'self' ws: wss: https://www.google-analytics.com https://api.whatsapp.com https://api.cloudinary.com https://upload-widget.cloudinary.com"
  : "connect-src 'self' https://www.google-analytics.com https://api.whatsapp.com https://api.cloudinary.com https://upload-widget.cloudinary.com";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "img-src 'self' data: blob: https://res.cloudinary.com",
      "media-src 'self' blob: https://res.cloudinary.com",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      connectSrc,
      "frame-src 'self' https://www.google.com https://upload-widget.cloudinary.com",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Necessário apenas para as imagens SVG provisórias em /public/images —
    // sem risco, pois são geradas internamente, não enviadas por usuários.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/produto/:slug", destination: "/produtos/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
