# YogiSpeaks — Setup & Run Guide

Complete guide to run the project **with Docker** or **without Docker** (local Node + PostgreSQL).

> Communication coaching CMS — not a travel product.

**Downloads:** [YogiSpeaks-Setup-Guide.docx](./YogiSpeaks-Setup-Guide.docx) · [YogiSpeaks-Setup-Guide.pdf](./YogiSpeaks-Setup-Guide.pdf)

---

## Architecture (quick)

| Service | Port | Role |
|---------|------|------|
| Frontend (Next.js) | `3000` | Public site + Admin CMS UI |
| Backend (NestJS) | `4000` | REST API + Swagger + `/uploads` |
| PostgreSQL 16+ | `5432` | Primary database |
| Redis 7 | `6379` | Optional (health stub skips if unset) |
| Nginx (Docker only) | `80` | Reverse proxy to frontend + API |

| URL | Path |
|-----|------|
| Site | http://localhost:3000 |
| Admin login | http://localhost:3000/admin/login |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |
| Health | http://localhost:4000/api/v1/health |
| Via Nginx (Docker) | http://localhost/ and http://localhost/api/ |

---

## Prerequisites

### Both paths

- Git
- Copy env templates — **never commit real `.env` files**

### Without Docker

- [Node.js 22+](https://nodejs.org/) (LTS)
- [pnpm 10](https://pnpm.io/) — `corepack enable && corepack prepare pnpm@10 --activate`
- [PostgreSQL 16+](https://www.postgresql.org/download/) running locally
- Redis optional

### With Docker

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine + Compose plugin (Linux)

---

## Environment files

Three templates exist. Copy them once and fill real values locally.

```bash
# From repo root
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

| File | Used by |
|------|---------|
| `.env` | Docker Compose + shared defaults |
| `backend/.env` | NestJS when you run backend with pnpm |
| `frontend/.env.local` | Next.js (`NEXT_PUBLIC_*`) |

### Values you must change

| Variable | Notes |
|----------|--------|
| `POSTGRES_PASSWORD` / `DATABASE_URL` | Match user, password, DB name |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | ≥ 32 characters each |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | Seed creates this admin; password ≥ 12 chars |
| `CORS_ORIGINS` / `FRONTEND_URL` | Must match the URL you open in the browser |
| `NEXT_PUBLIC_API_URL` | Browser calls this (local: `http://localhost:4000/api/v1`) |

Example local `DATABASE_URL`:

```text
postgresql://yogispeaks:YOUR_PASSWORD@127.0.0.1:5432/yogispeaks?schema=public
```

Windows tip: prefer `127.0.0.1` over `localhost` if Postgres auth fails oddly.

---

## Option A — Without Docker (recommended for daily development)

### 1. Install PostgreSQL

1. Install PostgreSQL 16+ and start the service.
2. Create a user/database (psql or pgAdmin), e.g.:

```sql
CREATE USER yogispeaks WITH PASSWORD 'YOUR_PASSWORD' CREATEDB;
CREATE DATABASE yogispeaks OWNER yogispeaks;
```

3. Put the matching URL in `backend/.env` (and root `.env` if you use it).

Redis is **optional**. Leave `REDIS_URL` empty or point at a local Redis if you have one.

### 2. Install dependencies

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

### 3. Migrate + seed

```bash
cd backend
pnpm exec prisma generate
pnpm exec prisma migrate deploy
# first-time / schema work: pnpm exec prisma migrate dev
pnpm exec prisma db seed
```

Seed creates roles, permissions, and the super-admin from `SUPER_ADMIN_*` in `backend/.env`.

### 4. Run backend + frontend (two terminals)

```bash
# Terminal 1 — API
cd backend
pnpm start:dev
# listens on http://localhost:4000
```

```bash
# Terminal 2 — UI
cd frontend
pnpm dev
# listens on http://localhost:3000
```

### 5. Log in to Admin

1. Open http://localhost:3000/admin/login  
2. Use `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` from `backend/.env`

### Useful commands (no Docker)

```bash
cd backend
pnpm prisma:studio          # browse DB
pnpm prisma:migrate         # create/apply migration in dev
pnpm typecheck
pnpm lint

cd frontend
pnpm typecheck
pnpm lint
pnpm build                  # production build check
```

### Uploads (local)

- Provider: `MEDIA_PROVIDER=local`
- Files land in `backend/uploads/` (auto-created on first upload / backend start)
- Folder is **gitignored** — not pushed to GitHub
- Served at `http://localhost:4000/uploads/<filename>`

---

## Option B — With Docker (full stack)

Compose starts: **Postgres + Redis + Backend + Frontend + Nginx**.

### 1. Configure root `.env`

```bash
cp .env.example .env
```

Edit at least:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (≥ 32 chars)
- `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` (≥ 12 chars)
- `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
- `NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1`  
  (or `http://localhost/api/v1` if the browser only talks through Nginx — keep CORS/FRONTEND_URL aligned)

Compose overrides DB/Redis hostnames inside the network:

- DB host → `postgres`
- Redis host → `redis`

You do **not** need local Node/Postgres installed for this path.

### 2. Build and start

```bash
# From repo root
docker compose up --build
```

Detached:

```bash
docker compose up --build -d
```

### 3. Run migrations + seed inside the backend container

Images start the API process; apply schema once after Postgres is healthy:

```bash
docker compose exec backend pnpm exec prisma migrate deploy
docker compose exec backend pnpm exec prisma db seed
```

Seed needs `SUPER_ADMIN_*` (and the rest of backend env) from the compose `.env` / container environment.

### 4. Open the apps

| Entry | URL |
|-------|-----|
| Nginx (preferred) | http://localhost |
| Frontend direct | http://localhost:3000 |
| Backend direct | http://localhost:4000/api/v1 |
| Admin | http://localhost:3000/admin/login |

### 5. Stop / reset

```bash
docker compose down          # stop containers, keep DB volume
docker compose down -v       # also delete postgres_data (wipes DB)
```

### Uploads (Docker)

- `backend/uploads` is mounted as a named/bind volume so files survive container rebuilds
- Nginx proxies `/uploads/` to the backend
- Still gitignored on the host if you bind-mount a local folder

### Hybrid: Docker only for DB (+ Redis)

Useful when you want local hot-reload with pnpm:

```bash
docker compose up postgres redis -d
```

Then point `backend/.env`:

```text
DATABASE_URL=postgresql://yogispeaks:YOUR_PASSWORD@127.0.0.1:5432/yogispeaks?schema=public
REDIS_URL=redis://127.0.0.1:6379
```

Expose Postgres/Redis ports if your compose file does not publish them — add under `postgres` / `redis`:

```yaml
ports:
  - "5432:5432"   # postgres
  - "6379:6379"   # redis
```

Then run backend/frontend with **Option A** steps 2–4.

---

## Verify everything works

1. Health: `GET http://localhost:4000/api/v1/health` → ok  
2. Swagger: http://localhost:4000/api/docs  
3. Admin login with seeded super-admin  
4. Upload a file in **Admin → Media** → file appears under `uploads/` and URL loads  

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Prisma `P1000` / auth failed | Wrong password or user in `DATABASE_URL`; reset Postgres password; use `127.0.0.1` |
| `citext` / type errors on migrate | Seed runs `CREATE EXTENSION IF NOT EXISTS "citext"`. As superuser once: `CREATE EXTENSION citext;` on the DB (and `template1` if migrate uses a shadow DB) |
| CORS / login cookie issues | `CORS_ORIGINS` and `FRONTEND_URL` must match the browser origin (`http://localhost:3000`) |
| Backend env validation fails | JWT secrets ≥ 32 chars; admin password ≥ 12; `COOKIE_SECURE` is `"true"` or `"false"` string |
| Admin 401 after restart | Re-seed or reset password; check you’re hitting the same API as `NEXT_PUBLIC_API_URL` |
| Docker backend unhealthy | Wait for Postgres healthcheck; check `docker compose logs backend` |
| Uploads 404 behind Nginx | Ensure `/uploads/` is proxied to backend (see `infra/nginx/default.conf`) |
| Port already in use | Stop other apps on 3000/4000/5432 or change ports in compose / `.env` |
| pnpm not found | `corepack enable` then `corepack prepare pnpm@10 --activate` |

---

## Production notes (short)

- Set `NODE_ENV=production`, strong secrets, `COOKIE_SECURE=true`, HTTPS.
- Prefer **Cloudinary or S3** (`MEDIA_PROVIDER`) over local disk when you scale past one server.
- Run `prisma migrate deploy` in CI/CD or container entrypoint before serving traffic.
- Do not commit `.env`, `uploads/`, or `node_modules/`.

---

## Related docs

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [IMPLEMENTATION_PROGRESS.md](./IMPLEMENTATION_PROGRESS.md)
- [DATABASE_PLAN.md](./DATABASE_PLAN.md)
- [API_PLAN.md](./API_PLAN.md)
- [TECHNOLOGY_DECISIONS.md](./TECHNOLOGY_DECISIONS.md)
