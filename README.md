# YogiSpeaks

Communication coaching platform — public marketing site, course pages, and admin CMS.

> **Not** a travel or package-booking product.

## Quick start

Full instructions: **[docs/SETUP.md](docs/SETUP.md)**

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit secrets, then:
cd backend && pnpm install && pnpm exec prisma migrate deploy && pnpm exec prisma db seed && pnpm start:dev
# Other terminal:
cd frontend && pnpm install && pnpm dev
```

| App | URL |
|-----|-----|
| Site | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| API (local) | http://localhost:4000/api/v1 |
| API (Render) | https://yogispeaks-backend.onrender.com/api/v1 |
| Swagger (local) | http://localhost:4000/api/docs |

Deployed backend requires the env keys in `backend/render.env.example` (set them in the Render dashboard — never commit secrets).

Admin user comes from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` (seed).

## Prerequisites

- Node.js **22+** and [pnpm 10](https://pnpm.io/)
- PostgreSQL **16+** running locally

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

- **[docs/SETUP.md](docs/SETUP.md)** — install & run
- [docs/YogiSpeaks-Setup-Guide.docx](docs/YogiSpeaks-Setup-Guide.docx) / [docs/YogiSpeaks-Setup-Guide.pdf](docs/YogiSpeaks-Setup-Guide.pdf)
- [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md)
- [docs/IMPLEMENTATION_PROGRESS.md](docs/IMPLEMENTATION_PROGRESS.md)
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- [docs/API_PLAN.md](docs/API_PLAN.md)
- [docs/DATABASE_PLAN.md](docs/DATABASE_PLAN.md)
- [docs/TECHNOLOGY_DECISIONS.md](docs/TECHNOLOGY_DECISIONS.md)
