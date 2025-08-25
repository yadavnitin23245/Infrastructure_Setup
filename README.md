
# Nx Next/Nest Hybrid Starter (Docker: Postgres + MinIO | Host: API + Web)

This repo gives you a **copy-pasteable demo** with:
- **Docker** (dev infra): PostgreSQL + MinIO (+ `mc` to auto-create `app-bucket`)
- **NestJS + Prisma** (API): JWT auth, presigned S3 upload URL
- **Next.js** (Web): login/register + upload demo
- **CI/CD** (optional): GitHub Actions build to GHCR with **live API URL injected at web build time**

## 0) Prereqs
- Node.js 20+, npm 9+
- Docker Desktop (Linux engine)
- Git

## 1) Setup
```bash
cp .env.example .env
npm ci
# (optional) create web env for local
cp apps/web/.env.local.example apps/web/.env.local
```

## 2) Start infra (Docker: Postgres + MinIO)
```bash
make up
# or
docker compose -f docker/dev/docker-compose.yml up -d
```

Verify:
- Postgres: `localhost:5432` (user: `app`, pass: `app`, db: `appdb`)
- MinIO Console: http://localhost:9001 (minio/minio123), bucket `app-bucket` should exist

## 3) Create tables (Prisma migrations)
```bash
npm run prisma:gen
npm run prisma:migrate
```

Check via psql inside container:
```bash
docker exec -it postgres-1 psql -U app -d appdb -c "\dt"   # name may be 'postgres' or 'nx-next...' - check docker ps
```

## 4) Run API & Web (host)
Open two terminals:

**A) API**
```bash
npm run dev:api   # http://localhost:4000
```

**B) Web**
```bash
npm run dev:web   # http://localhost:3000
```

### Demo flow
1) Web: Register → Login
2) Get Signed PUT URL → Upload (needs MinIO running)
3) MinIO console: see uploaded file in `app-bucket`
4) API health: http://localhost:4000/health

## 5) CI/CD (optional): GHCR images + live URL
Workflow: `.github/workflows/docker-ci.yml`

Set this repo secret:
- `WEB_PUBLIC_API_BASE` → e.g., `https://api.yourdomain.com`

Push to `main` → pipeline builds & pushes:
- API: `ghcr.io/<owner>/<repo>/api:latest`
- WEB: `ghcr.io/<owner>/<repo>/web:latest` (with public API base baked in)

## Troubleshooting
- Port conflict 5432 → change to "5433:5432" in compose and update `.env`
- P1000 auth failed → run migrations after containers are healthy
- Upload 403 → ensure MinIO up and `app-bucket` exists (mc creates it)
- CORS → enabled in API; narrow origins in prod

## Teardown
```bash
make down
```
------------------------------------------------------------------------------------------------------------

cp .env.example .env
Copy-Item .env apps/api/.env



npm ci
docker compose -f docker/dev/docker-compose.yml up -d  # Postgres + MinIO
npm run prisma:gen
npx prisma validate --schema=apps/api/prisma/schema.prisma
npm run prisma:migrate
npm run dev:api   # http://localhost:4000
npm run dev:web   # http://localhost:3000



2) Postgres up/healthy?
docker compose -f docker/dev/docker-compose.yml up -d
docker compose -f docker/dev/docker-compose.yml ps

(Optional) P1000 aata rahe to quick reset (dev only)
docker compose -f docker/dev/docker-compose.yml down -v
docker compose -f docker/dev/docker-compose.yml up -d

-----------------------------------

2) Purana pgAdmin state साफ़ करके recreate

PowerShell (repo root):

# stop + remove container
docker compose -f docker/dev/docker-compose.yml stop pgadmin
docker compose -f docker/dev/docker-compose.yml rm -f pgadmin

# old pgadmin volume remove (Name usually dev_pgadmin)
docker volume ls
#  use remove karo:
# example:
docker volume rm dev_pgadmin

# now ne pgAdmin up
docker compose -f docker/dev/docker-compose.yml up -d pgadmin

# check status
docker compose -f docker/dev/docker-compose.yml ps
# logs agar needed:
docker compose -f docker/dev/docker-compose.yml logs -f pgadmin
---------------------------------------

Browser → http://localhost:5050
 → login: admin@local.com / admin123 → Add New Server:

General → Name: local-postgres

Connection → Host name/address: postgres (compose network name)

Port: 5432

Username: app

Password: app

Database: appdb (optional)

 left tree: Servers → local-postgres → Databases → appdb → Schemas → public → Tables.

-------------

⏳ Baaki / Improve
Backend: logging, metrics, error tracking

Structured logging (pino)