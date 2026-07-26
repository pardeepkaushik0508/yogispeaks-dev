# YogiSpeaks — Setup & Run Guide

Complete guide to run the project with local Node.js and PostgreSQL.

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

| URL | Path |
|-----|------|
| Site | http://localhost:3000 |
| Admin login | http://localhost:3000/admin/login |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |
| Health | http://localhost:4000/api/v1/health |

---

## Prerequisites

- Git
- [Node.js 22+](https://nodejs.org/) (LTS)
- [pnpm 10](https://pnpm.io/) — `corepack enable && corepack prepare pnpm@10 --activate`
- [PostgreSQL 16+](https://www.postgresql.org/download/) running locally
- Redis optional
- Copy env templates — **never commit real `.env` files**

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
| `.env` | Shared defaults (optional reference) |
| `backend/.env` | NestJS when you run backend with pnpm |
| `frontend/.env.local` | Next.js (`NEXT_PUBLIC_*`) |

### Values you must change

| Variable | Notes |
|----------|--------|
| `POSTGRES_PASSWORD` / `DATABASE_URL` | Match user, password, DB name |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | ≥ 32 characters each |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | Seed creates this admin; password ≥ 12 chars |
| `CORS_ORIGINS` / `FRONTEND_URL` | Must match the URL you open in the browser |
| `NEXT_PUBLIC_API_URL` | Browser API base. Local: `http://localhost:4000/api/v1`. Deployed: `https://yogispeaks-backend.onrender.com/api/v1` |

Example local `DATABASE_URL`:

```text
postgresql://yogispeaks:YOUR_PASSWORD@127.0.0.1:5432/yogispeaks?schema=public
```

Windows tip: prefer `127.0.0.1` over `localhost` if Postgres auth fails oddly.

---

## Install & run

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

### Useful commands

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
| Port already in use | Stop other apps on 3000/4000/5432 or change ports in `.env` |
| pnpm not found | `corepack enable` then `corepack prepare pnpm@10 --activate` |

---

## Render deploy (backend)

Public API: `https://yogispeaks-backend.onrender.com/api/v1`

1. In the Render service → **Environment**, add every key from `backend/render.env.example`.
2. Required for boot (these caused the last crash when missing):
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` (≥ 32 chars each)
   - `FRONTEND_URL` / `CORS_ORIGINS` — **must include the live frontend origin**, e.g. `https://yogispeaks-l3vy.onrender.com` (localhost-only values cause admin login CORS / 405 preflight errors)
   - `COOKIE_SECURE=true`
   - `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (≥ 12 chars)
   - `MEDIA_PROVIDER=local` (or `cloudinary` / `s3`)
3. Link a Render Postgres so `DATABASE_URL` is set.
4. Frontend must use `NEXT_PUBLIC_API_URL=https://yogispeaks-backend.onrender.com/api/v1` and `NEXT_PUBLIC_SITE_URL=https://yogispeaks-l3vy.onrender.com`.
5. After changing `CORS_ORIGINS` / `FRONTEND_URL`, **Manual Deploy → Clear build cache & deploy** (or restart) the backend so CORS picks up the new origin.

---

## Production notes (short)

- Set `NODE_ENV=production`, strong secrets, `COOKIE_SECURE=true`, HTTPS.
- Prefer **Cloudinary or S3** (`MEDIA_PROVIDER`) over local disk when you scale past one server.
- Run `prisma migrate deploy` in CI/CD before serving traffic.
- Do not commit `.env`, `uploads/`, or `node_modules/`.

---

## Related docs

- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [IMPLEMENTATION_PROGRESS.md](./IMPLEMENTATION_PROGRESS.md)
- [DATABASE_PLAN.md](./DATABASE_PLAN.md)
- [API_PLAN.md](./API_PLAN.md)
- [TECHNOLOGY_DECISIONS.md](./TECHNOLOGY_DECISIONS.md)
