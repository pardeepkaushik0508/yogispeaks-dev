# YogiSpeaks — Missing Assets & Open Client Inputs

Phase 1 inventory of what exists vs what is still needed from the client. Development can proceed with **replaceable placeholders** for all media and configurable defaults for contact/SEO.

---

## 1. Available in repo (source of truth)

| Asset | Path | Use |
|-------|------|-----|
| Homepage visual reference | `reference/homepage-reference.jpg` | Pixel-target layout |
| Annotated CTA reference | `reference/homepage-annotated-reference.jpg` | Identify CTAs only |
| Primary logo | `reference/logo-primary.png` (+ alt copy) | Brand / seed logo |
| Technical requirements PDF | `docs/yogispeaks-technical-requirements.pdf` | Stack & delivery |
| Content checklist PDF | `docs/content-required.pdf` | What client must supply |
| Technology stack PDF | `docs/best-technology-stack.pdf` | Stack ideas only — **travel features ignored** |

---

## 2. Missing documents

| Expected | Status | Mitigation |
|----------|--------|------------|
| `docs/yogispeaks-homepage-content.pdf` | **Not provided** (not in Downloads or repo) | Transcribe seed copy from `reference/homepage-reference.jpg`; replace when client delivers Word/PDF copy |
| Founder legal name spelling | Reference shows **Yoginder** / prompts also use Yogender | Confirm once; store in site settings / homepage quote attribution |
| Final legal page text | Not provided | Placeholder pages with clear “pending client approval” wording |
| Approved blog articles (3–5) | Not provided | Seed outline posts as DRAFT or short starter articles for structure only |

---

## 3. Missing media (placeholders until supplied)

| Asset | Needed for | Placeholder approach |
|-------|------------|----------------------|
| Production logo PNG/SVG + favicon | Header, footer, PWA/favicon | Use `reference/logo-primary.png` in seed; admin can replace |
| High-res founder photo (cutout / studio) | Hero | Labeled placeholder image in media library |
| Course card photos (5) | Programs section | Neutral coaching placeholders |
| Testimonial avatars | Reviews carousel | Initials or stock placeholders with alt text |
| Blog featured images | Blog | Placeholders |
| Default Open Graph image | SEO share | Brand OG placeholder |
| Office / classroom / certificate photos | About (optional) | Optional empty until uploaded |
| Icon set | Features / steps | Lucide keys mapped in CMS; optional custom uploads later |

All placeholders are **MediaAsset** rows replaceable from `/admin/media` without code edits.

---

## 4. Missing business data (configure in admin / env)

| Item | Status |
|------|--------|
| Real mobile / WhatsApp numbers | TBD — use env or admin settings placeholders |
| Public email | TBD |
| Full office address + Google Maps embed | TBD (reference shows New Delhi, India) |
| Exact business hours | TBD |
| Live social profile URLs | TBD |
| Google Business Profile / reviews URL | TBD |
| Course fees (if displayed) | Optional per course; default hidden |
| SMTP credentials | Required for real email in staging/prod |
| Cloudinary or S3 credentials | Required for production media |
| TinyMCE API key | `NEXT_PUBLIC_TINYMCE_API_KEY` or self-hosted |
| Production domain + TLS certs | Deployment time |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | Env only — never commit |
| Google OAuth client IDs | Deferred — feature off |

---

## 5. Credentials & third-party services (client / DevOps)

| Service | Purpose | Blocks? |
|---------|---------|---------|
| PostgreSQL | Data | Local Docker for dev |
| Redis | Throttle/cache | Optional — degrade gracefully |
| SMTP | Password reset + enquiry emails | Dev can log emails to console |
| Cloudinary / S3 | Media | Local disk in development |
| TinyMCE Cloud | Editor | Self-hosted alternative documented |
| Analytics (optional) | Not required for v1 acceptance | — |

---

## 6. Content still needed from client (from content-required.pdf)

1. Final homepage headline / subheadline / CTA wording (if different from reference)  
2. About: intro, experience, qualifications, mission & vision  
3. Per-course: name, description, duration, mode, fee policy, benefits  
4. Real testimonials with permission + ratings  
5. Google review link + GBP details  
6. Contact + social confirmation  
7. Brand font preference (if any beyond design system proposal)  
8. SEO: business description, target keywords, default meta  
9. Legal policies approved text  
10. Blog topics or finished articles  

Client statement from checklist: they provide text, logo, photos, contact, courses, reviews, branding; developer designs, builds, optimizes, deploys.

---

## 7. Explicitly NOT missing (because excluded)

We are **not** waiting on travel-related assets:

- Destination lists, hotel images, flight/cab assets  
- PDF tour itineraries  
- Package price matrices  

Those belong to the unrelated travel brief and are out of scope.

---

## 8. Phase 1 decision

Proceed to Phase 2 with placeholders and reference-derived seed content. Track replacements in admin UAT checklist during Phase 7–8.
