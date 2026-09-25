import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---------------------------------------------------------------------
  // Usuário administrador inicial
  // Login: admin@aeroimports.com.br / admin123
  // O painel força a troca de senha no primeiro acesso.
  // ---------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@aeroimports.com.br" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@aeroimports.com.br",
      passwordHash,
      role: "ADMIN",
      mustChangePassword: true,
    },
  });

  // ---------------------------------------------------------------------
  // Categorias principais
  // ---------------------------------------------------------------------
  const categories = [
    { name: "Drones", slug: "drones" },
    { name: "Câmeras", slug: "cameras" },
    { name: "Estabilizadores", slug: "estabilizadores" },
    { name: "Microfones", slug: "microfones" },
    { name: "Celulares", slug: "celulares" },
    { name: "Baterias", slug: "baterias" },
    { name: "Hélices", slug: "helices" },
    { name: "Carregadores", slug: "carregadores" },
    { name: "Cases", slug: "cases" },
    { name: "Óculos FPV", slug: "oculos-fpv" },
    { name: "Controle Remoto", slug: "controle-remoto" },
    { name: "Peças", slug: "pecas" },
    { name: "Acessórios", slug: "acessorios" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // ---------------------------------------------------------------------
  // Páginas institucionais (Empresa, FAQ, Garantia, Termos, Privacidade)
  // NÃO são pré-criadas aqui de propósito: cada página pública já tem um
  // conteúdo padrão completo embutido no próprio componente (via
  // `getPageContent()`, em src/lib/pages.ts), usado como fallback sempre
  // que não existir registro no banco. Criar registros aqui com texto curto
  // de placeholder sobrescreveria esse fallback rico com um texto pior.
  // Para editar de verdade, crie/edite a página em /admin/paginas — o
  // conteúdo salvo lá passa a ter prioridade sobre o fallback automaticamente.

  console.log("Seed concluído: usuário admin e categorias criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
