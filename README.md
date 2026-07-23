# YogiSpeaks

Communication coaching platform — public marketing site, course pages, and admin CMS.

> **Not** a travel or package-booking product.

## Quick start

Full instructions (with Docker **and** without Docker): **[docs/SETUP.md](docs/SETUP.md)**

```bash
# Without Docker (dev)
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit secrets, then:
cd backend && pnpm install && pnpm exec prisma migrate deploy && pnpm exec prisma db seed && pnpm start:dev
# Other terminal:
cd frontend && pnpm install && pnpm dev
```

```bash
# With Docker
cp .env.example .env   # set strong passwords + JWT secrets
docker compose up --build
docker compose exec backend pnpm exec prisma migrate deploy
docker compose exec backend pnpm exec prisma db seed
```

| App | URL |
|-----|-----|
| Site | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| API | http://localhost:4000/api/v1 |
| Swagger | http://localhost:4000/api/docs |

Admin user comes from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (seed).

## Prerequisites

- Node.js **22+** and [pnpm 10](https://pnpm.io/) — *or* Docker Desktop
- PostgreSQL **16+** (bundled in Docker Compose)

## Security (GitHub)

| Commit? | Path |
|--------:|------|
| **Never** | `.env`, `backend/.env`, `frontend/.env.local`, `node_modules/`, `uploads/`, secrets |
| **Yes** | `.env.example`, `backend/.env.example`, `frontend/.env.example`, `docs/`, source code |

Templates use placeholders only. Put real passwords/JWT/Redis keys only in local `.env` files.

## First push to GitHub

Run these **from this project folder** (`yogispeakes`), not from your Windows user home:

```bash
git add .
git status   # confirm: no .env, no node_modules
git commit -m "Initial commit: YogiSpeaks coaching platform"
git branch -M main
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

## Documentation

- **[docs/SETUP.md](docs/SETUP.md)** — install & run (Docker / no Docker)
- [docs/YogiSpeaks-Setup-Guide.docx](docs/YogiSpeaks-Setup-Guide.docx) / [docs/YogiSpeaks-Setup-Guide.pdf](docs/YogiSpeaks-Setup-Guide.pdf)
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)
- [docs/IMPLEMENTATION_PROGRESS.md](docs/IMPLEMENTATION_PROGRESS.md)
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- [docs/API_PLAN.md](docs/API_PLAN.md)
- [docs/DATABASE_PLAN.md](docs/DATABASE_PLAN.md)
- [docs/TECHNOLOGY_DECISIONS.md](docs/TECHNOLOGY_DECISIONS.md)
