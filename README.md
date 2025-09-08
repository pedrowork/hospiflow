# HospiFlow

Monorepo com PWA (Next.js) e API (NestJS + Prisma + PostgreSQL).

## Stack
- Web (PWA): Next.js (App Router), TypeScript, TailwindCSS, next-pwa
- API: NestJS (Express), TypeScript, Prisma ORM
- Banco de dados: PostgreSQL (Docker)
- Infra dev: Docker Compose, scripts npm no monorepo

## Estrutura
- `apps/web`: PWA (frontend)
- `apps/api`: API NestJS (backend)

## Primeiros passos
```bash
# subir banco
npm run db:up

# API (dev)
npm run api:dev

# Web (dev)
npm run web:dev
```

## Variáveis de ambiente
Crie `apps/api/.env` com:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hospiflow?schema=public
PORT=3001
JWT_SECRET=change-me-strong
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```
Crie `apps/web/.env.local` se precisar sobrescrever `NEXT_PUBLIC_API_BASE_URL`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## Banco de dados
```bash
# gerar client e aplicar migrations
cd apps/api
npx prisma generate
npx prisma migrate dev --name init_postgres

# seed de exemplo
npm run seed
```

## Build/Start (web)
```bash
# na raiz
npm run build
npm start
```

## Deploy (referência rápida)
- Netlify (Web):
  - Base directory: `apps/web`
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Env: `NODE_VERSION=20`, `NEXT_PUBLIC_API_BASE_URL=https://sua-api`
- API (Docker): ver `docker-compose.yml` e `apps/api/Dockerfile` (opcional). Em produção, execute `npx prisma migrate deploy` antes de iniciar.

## Requisitos funcionais ATIVOS
- Episódios
  - Criar, listar, selecionar, fechar e resetar todos por usuário
  - Auto-criação de usuário quando ausente (fluxo simples de demo)
- Eventos
  - Registro de eventos rápidos por categoria (enfermagem, técnico, médico, exames, procedimentos)
  - Pares início/fim com cálculo de duração (timers)
  - Notas obrigatórias em início de evento e edição posterior
  - Suporte a evento retroativo (quando fim ocorre sem início): captura de data/hora inicial
  - Linha do tempo (single e pares) com estilos por categoria/variante
- Estatísticas/Relatórios
  - Gráficos (contagens por tipo, médias de duração, séries temporais)
  - Exportação TXT e CSV
- PWA
  - Manifest, ícones, instalação, offline fallback (`/offline`)
- Dev/Seed
  - Endpoint de seed e script `npm run seed` com dados de demonstração

## Requisitos não funcionais ATIVOS
- Segurança (API)
  - `helmet` (security headers)
  - `express-rate-limit` (limite de requisições)
  - CORS habilitado (localhost e LAN) para testes em dispositivos móveis
- Banco de dados
  - PostgreSQL via Docker, Prisma ORM, migrações versionadas
- Configuração/Qualidade
  - Validação de env com Zod (`env.validation.ts`)
  - ESLint/Prettier configurados; build web ignora lint/TS em CI quando necessário
- PWA/Offline
  - Service Worker com `next-pwa`, página offline e assets cacheados
- Deploy amigável
  - Scripts root para subir banco, API e Web; netlify.toml para build do Web

> Observação: Autenticação JWT (signup/login/refresh) está em progresso e não é exigida para o fluxo atual de demo.

## Documentação útil
- `comandos.md`: comandos Docker/Prisma/API/Web/Git/Firewall/Túnel
- `next features.md`: próximos passos e roadmap

## Segurança
- Nunca commitar arquivos `.env`.
- Segredos reais ficam fora do repositório; use os arquivos `*.env.example` como referência.
