import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

// ---- Modo manutenção -------------------------------------------------
// Lido da tabela SiteSetting (chave "site.maintenanceMode"), a mesma usada
// pela tela /admin/configuracoes. Guardamos em cache por alguns segundos
// dentro da própria instância de middleware pra não bater no banco a cada
// requisição — ligar/desligar pelo admin pode levar até ~15s pra valer.
let maintenanceCache: { value: boolean; expiresAt: number } | null = null;
const MAINTENANCE_CACHE_MS = 15_000;

async function isMaintenanceModeOn(): Promise<boolean> {
  const now = Date.now();
  if (maintenanceCache && maintenanceCache.expiresAt > now) {
    return maintenanceCache.value;
  }

  try {
    const sql = neon(process.env.DATABASE_URL as string);
    const rows = (await sql`
      SELECT "value" FROM "SiteSetting" WHERE "key" = 'site.maintenanceMode' LIMIT 1
    `) as { value: string }[];
    const value = rows[0]?.value === "true";
    maintenanceCache = { value, expiresAt: now + MAINTENANCE_CACHE_MS };
    return value;
  } catch {
    // Se o banco falhar aqui, prefere manter o site no ar (fail-open) em vez
    // de derrubar tudo por causa de uma checagem que nem é o site em si.
    return maintenanceCache?.value ?? false;
  }
}

const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Em manutenção | Aero Imports</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0B0F14;
    color: #E7ECF2;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif;
    text-align: center;
    padding: 24px;
  }
  .card { max-width: 420px; }
  .logo { width: 64px; height: 64px; margin: 0 auto 28px; }
  .dot { fill: #2C7BE0; }
  .line { stroke: #2C7BE0; stroke-width: 3; opacity: 0.6; }
  .corner { fill: #E7ECF2; opacity: 0.85; }
  h1 { font-size: 22px; font-weight: 600; margin: 0 0 12px; letter-spacing: -0.01em; }
  p { font-size: 14px; line-height: 1.6; color: #9BA7B4; margin: 0; }
  .pulse { animation: pulse 1.8s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
</style>
</head>
<body>
  <div class="card">
    <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line class="line" x1="50" y1="50" x2="15" y2="15" />
      <line class="line" x1="50" y1="50" x2="85" y2="15" />
      <line class="line" x1="50" y1="50" x2="15" y2="85" />
      <line class="line" x1="50" y1="50" x2="85" y2="85" />
      <circle class="corner" cx="15" cy="15" r="5" />
      <circle class="corner" cx="85" cy="15" r="5" />
      <circle class="corner" cx="15" cy="85" r="5" />
      <circle class="corner" cx="85" cy="85" r="5" />
      <circle class="dot pulse" cx="50" cy="50" r="9" />
    </svg>
    <h1>Voltamos já</h1>
    <p>Estamos fazendo uma atualização rápida no site. Isso não deve demorar — volte a tentar em alguns minutos.</p>
  </div>
</body>
</html>`;

function maintenanceResponse() {
  return new NextResponse(MAINTENANCE_HTML, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "Retry-After": "1800",
      "cache-control": "no-store",
    },
  });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminOrApi = pathname.startsWith("/admin") || pathname.startsWith("/api");

  // ---- Rotas públicas: checa modo manutenção -------------------------
  if (!isAdminOrApi) {
    // Só checa em navegações de página (Accept: text/html), pra não gastar
    // consulta ao banco em cada imagem/vídeo/asset carregado pela página.
    const acceptsHtml = req.headers.get("accept")?.includes("text/html") ?? true;
    if (acceptsHtml && (await isMaintenanceModeOn())) {
      return maintenanceResponse();
    }
    return NextResponse.next();
  }

  // ---- A partir daqui, é a lógica original de autenticação do /admin --
  const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const token = await getToken({ req });

  // Usuário já logado tentando acessar /admin/login: manda direto pro dashboard.
  if (isPublicAdminRoute) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Sem sessão: manda para o login.
  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Bloqueia qualquer papel que não seja ADMIN/SUPPORT dentro do painel.
  const role = (token as any)?.role;
  if (role !== "ADMIN" && role !== "SUPPORT") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Força troca de senha no primeiro acesso.
  const mustChange = (token as any)?.mustChangePassword;
  if (mustChange && !pathname.startsWith("/admin/trocar-senha")) {
    return NextResponse.redirect(new URL("/admin/trocar-senha", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|mp4|webm|txt|xml|woff|woff2)$).*)",
  ],
};
