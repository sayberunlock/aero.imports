import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const PUBLIC_ADMIN_ROUTES = ["/admin/login"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some((r) => pathname.startsWith(r));

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
  },
  {
    pages: { signIn: "/admin/login" },
    callbacks: {
      // Sempre deixa a função de middleware acima decidir — o padrão do
      // next-auth barra QUALQUER rota do matcher sem token, incluindo a
      // própria /admin/login, o que causava um loop infinito de redirect
      // e impedia o painel de abrir.
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
