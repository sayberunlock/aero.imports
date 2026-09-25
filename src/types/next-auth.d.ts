/**
 * Aumento de tipos do NextAuth.
 *
 * O NextAuth por padrão não conhece os campos customizados `role` e
 * `mustChangePassword` que devolvemos em `authorize()` (ver `src/lib/auth.ts`)
 * e propagamos para o token JWT e para a sessão. Sem esta declaração, todo
 * acesso a `session.user.role` ou `token.role` exigiria `as any`.
 *
 * Isso NÃO gera nem substitui nada do Prisma — é apenas uma extensão de
 * tipos do lado do NextAuth, então não depende de `prisma generate`.
 */
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    mustChangePassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    mustChangePassword: boolean;
  }
}
