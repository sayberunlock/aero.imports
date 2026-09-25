import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation";

/**
 * Configuração central de autenticação.
 *
 * - Autenticação apenas por credenciais (e-mail + senha) — não usamos
 *   PrismaAdapter porque o schema não define as tabelas Account/Session/
 *   VerificationToken que ele exige, e sessões JWT não precisam do adapter.
 * - Senhas nunca são armazenadas em texto puro: usamos bcrypt (custo 12).
 * - Sessões via JWT assinado, cookies HttpOnly + Secure + SameSite=Lax
 *   (definidos automaticamente pelo NextAuth em produção com HTTPS).
 * - `mustChangePassword` força a troca de senha no primeiro acesso do
 *   admin (ver /admin/trocar-senha).
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8h
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.mustChangePassword = user.mustChangePassword;
      }
      // Chamado explicitamente pela tela de troca de senha (via update()
      // do next-auth/react) assim que a senha é trocada com sucesso —
      // sem isso, o token continuava com mustChangePassword=true até a
      // sessão expirar (8h) ou o usuário sair e entrar de novo, mesmo com
      // o banco já atualizado.
      if (trigger === "update" && session?.mustChangePassword === false) {
        token.mustChangePassword = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.mustChangePassword = token.mustChangePassword;
      }
      return session;
    },
  },
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
