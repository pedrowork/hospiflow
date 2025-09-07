# HospiFlow API (NestJS + Prisma + PostgreSQL)

## Setup
```bash
npm install
```

## Dev
```bash
docker compose up -d postgres
npm run start:dev
```

## Banco de dados
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init_postgres
npm run seed
```

## Testes
```bash
npm run test
```

## Deploy migrations
```bash
npx prisma migrate deploy
```
