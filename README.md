# YogiSpeaks

Communication coaching platform — public marketing site, course pages, and admin CMS.

> **Not** a travel or package-booking product.

## Security (GitHub)

| Commit? | Path |
|--------:|------|
| **Never** | `.env`, `backend/.env`, `frontend/.env.local`, `node_modules/`, `uploads/`, secrets |
| **Yes** | `.env.example`, `backend/.env.example`, `frontend/.env.example`, `docs/`, source code |

Templates use `changeme_*` placeholders only. Put real passwords/JWT/Redis keys only in local `.env` files.

## Prerequisites

- Node.js **22+** and [pnpm 10](https://pnpm.io/)
- PostgreSQL **16+** (Docker optional: Redis 7)

## Setup (local)

```bash
# 1) Clone
git clone <your-repo-url> yogispeakes
cd yogispeakes

# 2) Env files (from templates — edit secrets locally)
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3) Install
cd backend && pnpm install && cd ..
cd frontend && pnpm install && cd ..

# 4) Database
cd backend
pnpm exec prisma migrate deploy   # or: prisma migrate dev
pnpm exec prisma db seed
pnpm start:dev

# 5) Frontend (other terminal)
cd frontend
pnpm dev
```

| App | URL |
|-----|-----|
| Site | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |

Admin user comes from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` in `backend/.env` (seed).

## Docker (optional)

```bash
cp .env.example .env
# set strong POSTGRES_PASSWORD, JWT_*, SUPER_ADMIN_*
docker compose up --build
```

## First push to GitHub

Run these **from this project folder** (`yogispeakes`), not from your Windows user home:

```bash
git init
git add .
git status   # confirm: no .env, no node_modules
git commit -m "Initial commit: YogiSpeaks coaching platform"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

## Documentation

- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)
- [docs/IMPLEMENTATION_PROGRESS.md](docs/IMPLEMENTATION_PROGRESS.md)
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- [docs/API_PLAN.md](docs/API_PLAN.md)
- [docs/DATABASE_PLAN.md](docs/DATABASE_PLAN.md)
- [docs/TECHNOLOGY_DECISIONS.md](docs/TECHNOLOGY_DECISIONS.md)
