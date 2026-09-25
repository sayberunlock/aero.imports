import { PrismaClient } from "@prisma/client";

/**
 * Script único para redefinir a senha do usuário admin diretamente no
 * banco de dados. Use isso quando não for possível trocar a senha pelo
 * próprio painel (esqueceu a senha atual, por exemplo).
 *
 * Como usar:
 *   1. Rode este script no MESMO ambiente/servidor onde o site está
 *      publicado (ele precisa enxergar a DATABASE_URL de produção,
 *      igual ao "npm run db:seed").
 *   2. Comando:  npx tsx prisma/reset-admin-password.ts
 *   3. O terminal deve mostrar "Senha atualizada com sucesso".
 *   4. Depois de confirmar que o login novo funciona, pode apagar este
 *      arquivo — ele não é usado em nenhum outro lugar do site.
 *
 * O hash abaixo já é o resultado da nova senha (bcrypt, custo 12, igual
 * ao usado no restante do projeto) — a senha em texto puro NÃO fica
 * salva em lugar nenhum do código, só na mensagem que o Sayber recebeu.
 */
const ADMIN_EMAIL = "admin@aeroimports.com.br";
const NEW_PASSWORD_HASH =
  "$2b$12$OuXL6fSJ.lKpkBjbdKjmv./Q8Uat.sTK.ddQaA/92pC5by7jN9dXe";

const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.update({
    where: { email: ADMIN_EMAIL },
    data: {
      passwordHash: NEW_PASSWORD_HASH,
      mustChangePassword: false,
    },
  });
  console.log(`Senha atualizada com sucesso para: ${updated.email}`);
}

main()
  .catch((e) => {
    console.error(
      "Não foi possível atualizar a senha. Verifique se o e-mail existe no banco e se a DATABASE_URL aponta para o banco certo.\n",
      e
    );
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
