# Comandos úteis — HospiFlow

Pequeno guia com os principais comandos usados no projeto (Windows/PowerShell).

## Docker e Postgres
- Subir somente o Postgres
```powershell
docker compose up -d postgres
```
- Ver containers/serviços
```powershell
docker ps
docker compose ps
```
- Parar/remover um container antigo (ex.: hospapp-postgres)
```powershell
docker stop hospapp-postgres
docker rm hospapp-postgres
```
- Acessar o psql no container
```powershell
docker exec -it hospiflow-postgres psql -U postgres -d hospiflow
```
- Criar/Excluir bancos via psql
```powershell
docker exec -it hospiflow-postgres psql -U postgres -c "CREATE DATABASE hospiflow;"
docker exec -it hospiflow-postgres psql -U postgres -c "DROP DATABASE IF EXISTS hospapp WITH (FORCE);"
```
- Subir API (com compose que inclui a API)
```powershell
docker compose build api
docker compose up -d
```
- Logs da API
```powershell
docker compose logs -f api
```

## Prisma (migrations/seed)
- Gerar Prisma Client
```powershell
cd apps\api
npx prisma generate
```
- Criar/aplicar migração em dev
```powershell
npx prisma migrate dev --name init_postgres
```
- Resetar banco e reaplicar tudo (DANGER: apaga dados)
```powershell
npx prisma migrate reset --force
```
- Aplicar migrações existentes (CI/produção)
```powershell
npx prisma migrate deploy
```
- Abrir Prisma Studio (GUI do banco)
```powershell
npx prisma studio
```
- Popular dados de exemplo
```powershell
npm run seed
```

## API (NestJS)
- Rodar API em desenvolvimento
```powershell
npm --prefix apps/api run start:dev
```

## Web (Next.js / PWA)
- Rodar o app web em desenvolvimento
```powershell
npm --prefix apps/web run dev
```
- Rodar expondo na LAN (0.0.0.0) e apontando para a API
```powershell
cd apps\web
set NEXT_PUBLIC_API_BASE_URL=http://192.168.18.94:3001
npx next dev -H 0.0.0.0 -p 3000
```
- Scripts na raiz
```powershell
npm run dev       # api+web em paralelo
npm run build     # build do web
npm start         # start do web
```

## Rede e Firewall (Windows)
- Descobrir IP e máscara
```powershell
ipconfig
```
- Listar IPs privados e prefixo (CIDR)
```powershell
Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -match '^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)' } |
  Select-Object IPAddress, PrefixLength, InterfaceAlias
```
- Liberar portas 3000/3001 no Firewall (executar como Administrador)
```powershell
netsh advfirewall firewall add rule name="HospiFlow API 3001" dir=in action=allow protocol=TCP localport=3001
netsh advfirewall firewall add rule name="HospiFlow Web 3000" dir=in action=allow protocol=TCP localport=3000
```

## Túnel público (para usar Netlify com API local)
- Expor a API local via Cloudflare Tunnel (exemplo)
```powershell
cloudflared tunnel --url http://localhost:3001
```
Use a URL HTTPS gerada em `NEXT_PUBLIC_API_BASE_URL` na Netlify.

## Git (repositório)
- Inicializar, commitar e enviar
```powershell
git init
git add .
git commit -m "chore: init HospiFlow repo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/hospiflow.git
git push -u origin main
```
- Remover repositório Git aninhado (se necessário)
```powershell
powershell -NoProfile -NonInteractive -Command "Remove-Item -Recurse -Force apps\web\.git"
```

## psql (dentro do cliente)
- Listar schemas/tabelas e descrever tabelas
```sql
\dn
\dt
\dt public.*
\d "User"
\d+ "Event"
```
- Consultas rápidas
```sql
SELECT COUNT(*) FROM "Episode";
SELECT * FROM "Event" ORDER BY "occurredAt" DESC LIMIT 10;
```

## Netlify (referência rápida)
- Base directory: `apps/web`
- Build command: `npm run build`
- Publish directory: `.next`
- Env: `NODE_VERSION=20`, `NEXT_PUBLIC_API_BASE_URL=https://sua-api`
