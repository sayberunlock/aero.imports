# Aero Imports — Site Institucional & Loja Virtual

Site oficial da Aero Imports: catálogo DJI, loja virtual, área do cliente
e painel administrativo. Construído com Next.js 14 (App Router), TypeScript,
Tailwind CSS, Framer Motion e Prisma (banco local em SQLite — ver seção 1-A).

> **Status do projeto:** fundação completa e funcional (Fase 1). Cobre
> arquitetura, design system, home, catálogo, autenticação e esqueleto do
> painel administrativo. O checkout é feito via WhatsApp (sem gateway de
> pagamento integrado ao site — ver seção 4-A). Módulos de CRUD completos
> do admin, frete e envio de e-mail transacional estão estruturados no
> schema do banco e nas rotas, mas precisam da integração final com os
> provedores escolhidos (transportadora, SMTP). Ver seção "Próximos
> passos" no final deste documento.

---

## 1. Stack técnica

| Camada          | Tecnologia                                      |
|-----------------|--------------------------------------------------|
| Frontend        | Next.js 14 (App Router) + React 18 + TypeScript |
| Estilo          | Tailwind CSS + Framer Motion (+ GSAP quando necessário) |
| Backend         | Rotas de API do Next.js (Node.js) + Prisma ORM  |
| Banco de dados  | SQLite (arquivo local — ver seção 1-A)          |
| Autenticação    | NextAuth (credenciais + bcrypt + JWT)            |
| Mídia           | Cloudinary (imagens, vídeos, banners)            |
| Validação       | Zod                                              |

---

## 1-A. Sobre o banco de dados (SQLite local)

O projeto usa **SQLite** por padrão: um único arquivo `dev.db`, criado
automaticamente dentro da própria pasta do projeto na primeira vez que você
roda `npx prisma db push` — **não precisa instalar, configurar nem rodar
nenhum servidor de banco separado**. É o suficiente para rodar localmente,
ver o design funcionando e até para produção em baixa escala.

Se no futuro precisar de PostgreSQL (ex.: mais de um admin editando ao
mesmo tempo em produção, ou hospedagem que já oferece Postgres gerenciado),
a migração é simples porque o schema não usa nenhum recurso exclusivo de
um ou outro banco:

1. Em `prisma/schema.prisma`, troque `provider = "sqlite"` por
   `provider = "postgresql"`.
2. No `.env`, troque `DATABASE_URL="file:./dev.db"` por uma URL de conexão
   Postgres (ex.: `postgresql://usuario:senha@localhost:5432/aero_imports`).
3. Rode `npx prisma generate && npx prisma db push` de novo.

---

## 2. Instalação local

### Pré-requisitos
- Node.js 18.18+
- npm 9+

(Não precisa de PostgreSQL nem de nenhum outro banco instalado — ver
seção 1-A.)

### Passo a passo

```bash
# 1. Instalar dependências
npm install

# 2. Variáveis de ambiente: o projeto já vem com um .env pronto para
# preview local (SQLite). Se quiser revisar/trocar algo, copie de novo a
# partir do exemplo:
# cp .env.example .env

# 3. Criar as tabelas no banco de dados (cria o arquivo dev.db automaticamente)
npm run db:push

# 4. Popular dados iniciais (usuário admin + categorias)
npm run db:seed

# 5. Iniciar em modo desenvolvimento
npm run dev
```

O site abre em `http://localhost:3000`.
O painel administrativo abre em `http://localhost:3000/admin`.

**Login inicial do painel:**
- Usuário: `admin@aeroimports.com.br`
- Senha: `admin123`

No primeiro acesso, o sistema **obriga a troca de senha** antes de liberar
o restante do painel.

---

## 3. Estrutura de pastas

```
app/                    Rotas (App Router) — páginas públicas, admin e API
  admin/(auth)/         Login e troca de senha do painel
  admin/(dashboard)/    Telas internas do painel administrativo
  api/                  Rotas de backend (auth, contato, produtos, pedidos)
  produtos/[slug]/      Página de detalhe de produto
  [categorias]/         Uma rota por categoria (drones, cameras, etc.)
src/
  components/           Componentes React reutilizáveis
    layout/             Header, Footer, botão do WhatsApp
    home/               Seções da página inicial
    produto/            Card de produto, galeria, etc.
    ui/                 Elementos de UI genéricos (Reveal, FlightTrace)
    forms/              Formulários com validação
  lib/                  Config do site, autenticação, banco, validação, utils
prisma/
  schema.prisma         Schema completo do banco de dados
  seed.ts               Dados iniciais (admin + categorias)
docs/
  DESIGN_SYSTEM.md       Paleta, tipografia e diretrizes visuais
public/
  images/, videos/       Substitua estes arquivos pelos definitivos
                         (logo, banners, vídeo do hero) sem tocar no código —
                         basta manter os mesmos nomes de arquivo, ou trocar
                         a URL no painel /admin/banners e /admin/videos.
```

---

## 4. Substituindo logo, vídeos e imagens

Nenhuma logo, vídeo ou imagem definitiva foi incluída neste momento —
o projeto usa placeholders identificados. Quando os arquivos finais forem
enviados, existem duas formas de aplicá-los **sem alterar código**:

1. **Pelo painel administrativo** (`/admin/banners`, `/admin/videos`,
   `/admin/produtos`): faça upload do arquivo e ele passa a ser servido
   automaticamente no lugar do placeholder.
2. **Diretamente nos arquivos estáticos**: substitua os arquivos em
   `public/images/` e `public/videos/` mantendo exatamente os mesmos nomes
   (ex.: `public/videos/hero.mp4`, `public/images/logo.png`).

---

## 4-A. Checkout via WhatsApp (sem gateway de pagamento)

O site não processa pagamento online: não há Stripe, Mercado Pago,
Pagar.me ou qualquer gateway integrado. O fluxo de compra é:

1. O cliente monta o carrinho normalmente (`/carrinho`) ou clica em
   **"Comprar agora"** na página do produto.
2. Ao finalizar, o site monta uma mensagem com os itens, quantidades e
   total (`src/lib/whatsapp.ts`) e abre `https://wa.me/<numero>` com essa
   mensagem pré-preenchida.
3. Pagamento, frete e prazo são combinados diretamente pela equipe no
   WhatsApp — não é criado nenhum registro automático de pedido no banco
   nesse fluxo (essa foi uma decisão de produto confirmada explicitamente;
   ver comentários em `src/lib/whatsapp.ts` e `app/carrinho/page.tsx`).

O número de WhatsApp usado em **todo** o site (botão flutuante, hero,
garantia, assistência técnica e checkout) vem de um único lugar:
`siteConfig.whatsapp` em `src/lib/site-config.ts`, com valor editável em
`/admin/configuracoes` (chave `site.whatsapp`). Nunca hardcode o número em
outro arquivo.

O model `Order`, a rota `/api/pedidos` e o painel `/admin/pedidos`
continuam existindo no schema/código para uso futuro do admin (ex.:
registrar manualmente um pedido fechado por WhatsApp), mas não fazem
parte do fluxo de compra público hoje.

---

## 5. Segurança implementada

- Senhas com hash bcrypt (custo 12), nunca armazenadas em texto puro.
- Sessões via JWT assinado + cookies HttpOnly/Secure/SameSite.
- Middleware protegendo todas as rotas `/admin/*` por papel (`ADMIN`/`SUPPORT`).
- Obrigatoriedade de troca de senha no primeiro login administrativo.
- Rate limiting em login, formulário de contato e checkout
  (`src/lib/rate-limit.ts` — trocar por Redis em produção com múltiplas instâncias).
- Sanitização de entradas com Zod + DOMPurify.
- Cabeçalhos de segurança (CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy) configurados em `next.config.mjs`.
- Log de auditoria (`AuditLog`) para ações sensíveis (ex.: troca de senha).
- Proteção contra SQL Injection nativa do Prisma (queries parametrizadas).

**Antes de ir para produção:** revise o segredo `NEXTAUTH_SECRET`, ative
HTTPS obrigatório no VPS/proxy, configure o Redis para rate limiting
distribuído se houver mais de uma instância, e defina uma política de
backup automatizado do PostgreSQL (ver seção 7).

---

## 6. SEO

- Metadados dinâmicos por página (`generateMetadata`), Open Graph e Twitter Card.
- `schema.org` (Organization no layout raiz, Product em cada página de produto).
- `app/sitemap.ts` gera o `sitemap.xml` dinamicamente a partir do catálogo real.
- `app/robots.ts` gera o `robots.txt` bloqueando `/admin`, `/api`, `/conta`, `/carrinho`.
- URLs amigáveis (`/produtos/dji-mavic-3-pro`, `/drones`, etc.).

Após o deploy, cadastre o site no Google Search Console e envie o
`sitemap.xml` manualmente na primeira vez.

---

## 7. Deploy em VPS (visão geral)

```bash
# No servidor (Ubuntu 22.04+ como exemplo)
sudo apt update && sudo apt install -y nginx postgresql
npm install -g pm2

git clone <repositorio> aero-imports
cd aero-imports
npm install
cp .env.example .env   # preencher com dados de produção
npm run build
npm run db:push
npm run db:seed         # apenas na primeira instalação

pm2 start npm --name "aero-imports" -- start
pm2 save
```

Configure o Nginx como proxy reverso para a porta `3000`, com certificado
TLS (Certbot/Let's Encrypt) e os cabeçalhos de segurança já definidos no
`next.config.mjs`. Para backups do PostgreSQL, agende um `pg_dump` diário
via `cron`, com retenção definida pela equipe (o painel `/admin/backup`
oferece exportação manual complementar).

---

## 8. Próximos passos (Fase 2)

- [ ] CRUD completo de Produtos, Banners, Vídeos, Cupons e Blog no painel.
- [ ] Cálculo de frete real (Correios/transportadora via API).
- [ ] Envio de e-mails transacionais (confirmação de pedido, recuperação de senha).
- [ ] Testes automatizados (unitários e end-to-end).
- [ ] Migração dos dados de exemplo (`src/lib/sample-data.ts`) para o banco real.
- [ ] Revisão jurídica dos textos de Política de Privacidade e Termos de Uso.
- [ ] Substituição da logo e dos vídeos definitivos.

---

## 9. Licença e uso

Projeto de uso exclusivo da Aero Imports. Código organizado em componentes
reutilizáveis e documentado para facilitar manutenção por qualquer
desenvolvedor Next.js/TypeScript no futuro.
