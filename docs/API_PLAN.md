# YogiSpeaks — API Plan

Base URL: `{API_ORIGIN}/api/v1`  
Style: REST · JSON  
Docs: Swagger/OpenAPI at `/api/docs` (non-production or protected in prod)

**Out of scope:** Travel package search/filter/itinerary endpoints.

---

## 1. Response envelope

Success:

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {},
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Human-readable error",
  "errors": [{ "field": "email", "message": "Invalid email" }],
  "meta": { "requestId": "…" }
}
```

HTTP codes: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500` (no stack traces in production).

---

## 2. Auth module

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/auth/login` | Public | Rate limited; returns access token; sets refresh HttpOnly cookie |
| POST | `/auth/refresh` | Cookie | Rotate refresh; revoke old |
| POST | `/auth/logout` | Auth | Revoke current session |
| POST | `/auth/logout-all` | Auth | Revoke all sessions |
| POST | `/auth/forgot-password` | Public | Always generic message |
| POST | `/auth/reset-password` | Public | Token + new password; revoke sessions |
| POST | `/auth/change-password` | Auth | Current + new |
| GET | `/auth/me` | Auth | Profile + roles + permissions |

**Tokens:** Short-lived JWT access; long-lived hashed refresh in DB. No auth secrets in localStorage. CSRF strategy when cookies used (double-submit or SameSite + custom header).

Google OAuth: routes stubbed / config-gated — **disabled** until credentials exist.

---

## 3. Public content (read)

| Method | Path | Notes |
|--------|------|-------|
| GET | `/public/site` | Settings, nav, footer, brand CSS vars payload |
| GET | `/public/homepage` | Visible sections + nested stats/features/steps/benefits + featured FAQs/courses/testimonials |
| GET | `/public/courses` | Published list; query: search, featured |
| GET | `/public/courses/:slug` | Detail |
| GET | `/public/testimonials` | Visible |
| GET | `/public/faqs` | Visible; optional category |
| GET | `/public/blogs` | Published; pagination |
| GET | `/public/blogs/:slug` | Detail |
| GET | `/public/pages/:slug` | Published page |

Cache headers / Redis-ready cache keys for public GETs (invalidate on admin write).

---

## 4. Public submissions

| Method | Path | Notes |
|--------|------|-------|
| POST | `/public/inquiries/assessment` | Full assessment DTO; rate limit; honeypot |
| POST | `/public/inquiries/contact` | Contact DTO |
| POST | `/public/newsletter/subscribe` | Email; idempotent / friendly duplicate handling |

Side effects: persist → user confirmation email → admin notification. Email failure does not roll back saved enquiry (logged + retried policy).

---

## 5. Admin CRUD pattern

For each resource: `GET list` (page, search, filter, sort), `GET :id`, `POST`, `PATCH :id`, `DELETE :id` (soft where applicable), plus:

| Extra | Resources |
|-------|-----------|
| `POST /reorder` | navigation, faqs, testimonials, features, steps, benefits, courses, homepage sections |
| `POST /:id/notes` | inquiries |
| `PATCH /:id/status` | inquiries, publish status helpers |
| `GET /export` | inquiries, newsletter (CSV) |
| `POST /upload` | media |

### Admin route map

| Module | Base path | Roles (summary) |
|--------|-----------|-----------------|
| Dashboard | `/admin/dashboard/stats` | SUPER_ADMIN, ADMIN, EDITOR |
| Users | `/admin/users` | SUPER_ADMIN |
| Roles | `/admin/roles` | SUPER_ADMIN (read for others if needed) |
| Site settings | `/admin/site-settings` | SUPER_ADMIN, ADMIN |
| Navigation | `/admin/navigation` | SUPER_ADMIN, ADMIN |
| Homepage | `/admin/homepage/*` | SUPER_ADMIN, ADMIN, EDITOR (content) |
| Pages | `/admin/pages` | SUPER_ADMIN, ADMIN, EDITOR |
| Courses | `/admin/courses` | SUPER_ADMIN, ADMIN, EDITOR |
| Testimonials | `/admin/testimonials` | SUPER_ADMIN, ADMIN, EDITOR |
| FAQs | `/admin/faqs` | SUPER_ADMIN, ADMIN, EDITOR |
| Blogs | `/admin/blogs` | SUPER_ADMIN, ADMIN, EDITOR |
| Blog categories | `/admin/blog-categories` | SUPER_ADMIN, ADMIN, EDITOR |
| Media | `/admin/media` | SUPER_ADMIN, ADMIN, EDITOR |
| Inquiries | `/admin/inquiries` | SUPER_ADMIN, ADMIN |
| Newsletter | `/admin/newsletter` | SUPER_ADMIN, ADMIN |
| Email templates | `/admin/email-templates` | SUPER_ADMIN, ADMIN |
| Audit logs | `/admin/audit-logs` | SUPER_ADMIN |
| Health | `/health`, `/health/db`, `/health/redis` | Public / infra |

EDITOR cannot manage users, security settings, or (by default) audit logs / site security fields.

Frontend route guards are UX only; **every** admin endpoint enforces permissions.

---

## 6. Permission codes (initial)

```text
dashboard.read
users.manage
roles.manage
settings.manage
navigation.manage
homepage.manage
pages.manage
courses.manage
testimonials.manage
faqs.manage
blogs.manage
media.manage
inquiries.manage
newsletter.manage
email_templates.manage
audit.read
```

Mapped onto SUPER_ADMIN (all), ADMIN (all except users/roles/audit as configured), EDITOR (content modules only).

---

## 7. Validation & security middleware

- Global ValidationPipe (`whitelist`, `forbidNonWhitelisted`, `transform`)  
- Helmet, CORS allowlist from `CORS_ORIGINS`  
- Rate limiting (login + public forms stricter)  
- Request size limits  
- sanitize-html allowlist on all rich-text fields before persist  
- File upload: mime allowlist, size cap, no executables  
- Env validation at bootstrap  
- Structured logging + request ID  
- Prisma parameterized queries only  

---

## 8. Media API

| Method | Path | Notes |
|--------|------|-------|
| POST | `/admin/media/upload` | Multipart |
| GET | `/admin/media` | Search, pagination |
| PATCH | `/admin/media/:id` | alt, title, caption |
| DELETE | `/admin/media/:id` | Block if referenced (or soft) |
| GET | `/admin/media/:id` | Detail |

Providers: Local (dev), Cloudinary or S3 (prod) behind interface.

---

## 9. Email

Provider abstraction over Nodemailer. Templates loaded from DB with merge tags. Failures logged; inquiry remains saved.

---

## 10. NestJS module list

`AuthModule`, `AdminUsersModule`, `RolesModule`, `SiteSettingsModule`, `NavigationModule`, `HomepageModule`, `PagesModule`, `CoursesModule`, `TestimonialsModule`, `FaqsModule`, `BlogsModule`, `BlogCategoriesModule`, `MediaModule`, `InquiriesModule`, `NewsletterModule`, `EmailTemplatesModule`, `SeoModule` (helpers / sitemap data), `DashboardModule`, `AuditLogsModule`, `HealthModule`, `PrismaModule`, `MailModule`, `CommonModule`.

Each module: controller, service, DTOs, guards as needed, tests, JSDoc on public methods.

---

## 11. Frontend consumption

- Server Components fetch public endpoints where SEO/caching helps  
- TanStack Query for admin  
- Central API client + error mapping  
- No `DATABASE_URL` or JWT secrets in frontend env  

Sitemap/robots generated in Next.js using public API or backend SEO endpoints.

---

## 12. Explicit non-endpoints

Will **not** exist:

- `/packages`, destination search, hotel filters, itinerary PDF upload for tours  
- Payment / booking / flight / hotel inventory APIs  
- Customer end-user accounts (v1) — admin-only auth
