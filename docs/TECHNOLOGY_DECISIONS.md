# Technology Decisions — YogiSpeaks

Stack choices for the YogiSpeaks communication coaching platform (July 2026).

## Core stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend framework | **Next.js 16.2.11** | Active LTS with July 2026 security patch |
| UI library | **React 19.2.4** | Paired with Next.js App Router |
| Styling | **Tailwind CSS 4.3.x** | CSS-first config via `@import "tailwindcss"` |
| Backend | **NestJS 11** | Modular API, guards, Swagger |
| ORM | **Prisma 7.2** | With `@prisma/adapter-pg` driver adapter |
| Validation | **Zod 4.x** | Shared patterns with frontend env/forms |
| Package manager | **pnpm 10** | Monorepo-style apps under one repo root |

## Prisma 7 driver adapter

Prisma 7 requires a database driver adapter for PostgreSQL. YogiSpeaks uses `@prisma/adapter-pg` with the `pg` pool in the NestJS `PrismaModule`. CLI config lives in `backend/prisma.config.ts`; migrations and seed run via `pnpm exec prisma …` from `backend/`.

## Typography

Public site headings and body use **Plus Jakarta Sans** via `next/font` until a final licensed alternative is chosen (see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)).

## Explicitly excluded

Features from `reference/best-technology-stack.pdf` aimed at **Thomas Cook / travel** (package search, hotel inventory, itinerary booking, destination filters, GDS integrations, etc.) are **out of scope**. YogiSpeaks is a coaching CMS only — courses, testimonials, FAQs, inquiries, and blog content.

## Related docs

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- [API_PLAN.md](./API_PLAN.md)
- [DATABASE_PLAN.md](./DATABASE_PLAN.md)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
