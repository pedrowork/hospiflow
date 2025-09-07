# HospiFlow

Monorepo com PWA (Next.js) e API (NestJS + Prisma + PostgreSQL).

## Requisitos
- Node 20+
- Docker Desktop (para PostgreSQL)

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

## Produção
```bash
# aplicar migrations no ambiente
npx prisma migrate deploy
```

## Segurança
- Nunca commitar arquivos `.env`.
- Credenciais estão apenas em `example.env` sem segredos reais.
