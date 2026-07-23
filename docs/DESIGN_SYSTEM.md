# YogiSpeaks — Design System

Primary visual source: `reference/homepage-reference.jpg`.  
Brand mark: `reference/logo-primary.png`.  
Annotated greens in `homepage-annotated-reference.jpg` identify CTAs only — **never** ship those markings.

---

## 1. Brand personality

Professional, authoritative coaching brand. Deep navy grounds trust; metallic gold signals premium CTAs and highlights; white surfaces keep course/FAQ content readable.

**Not** a travel marketplace UI. No package cards, hotel stars, destination filters, or itinerary timelines.

---

## 2. Color tokens (CSS variables)

Runtime theme variables (editable from admin → injected on `<html>`):

| Token | Role | Approx. from reference / logo |
|-------|------|-------------------------------|
| `--color-primary` | Navy surfaces, headers on light | `#0a192f` |
| `--color-primary-dark` | Hero / footer / testimonials band | `#050a18` – `#000d21` |
| `--color-secondary` | Secondary navy accents | `#112240` |
| `--color-accent` | Gold CTAs, highlights, icons | `#c49b48` – `#c59d5f` |
| `--color-accent-hover` | Gold hover | slightly darker gold |
| `--color-background` | Page background | `#ffffff` |
| `--color-surface` | Soft panels (“What You Get”) | `#f9f9f9` |
| `--color-text` | Primary text on light | `#111827` / near-black |
| `--color-muted` | Body secondary | `#6b7280` |
| `--color-on-dark` | Text on navy | `#ffffff` |
| `--color-on-dark-muted` | Muted on navy | `#c9d1d9` |
| `--color-success` | Checkmarks / success | accessible green |
| `--color-danger` | Errors | accessible red |
| `--color-border` | Dividers | `#e5e7eb` |

### Tailwind integration

- Map semantic utilities to CSS variables (`bg-[var(--color-accent)]`, or Tailwind `@theme` aliases).  
- Changing admin brand colors updates variables **without** rebuilding utility class names.  
- Validate hex on save (Zod / class-validator).

### Contrast

- Gold buttons: dark navy label text (matches reference); verify WCAG AA on chosen gold.  
- Body text on white: dark grey/black.  
- Muted text must remain readable; do not rely on color alone for status.

---

## 3. Typography

| Role | Direction | Notes |
|------|-----------|-------|
| Display / headings | Bold modern sans (e.g. Montserrat / Plus Jakarta Sans — final pick in Phase 2) | Hero large, tight line-height |
| Body | Clean sans companion | 16px base, 1.5–1.6 line-height |
| Logo monogram | Serif character art (in logo asset) | Do not fake YS with web fonts for the mark |
| Quote | Slightly italic on dark | Founder quote |

Load via `next/font`. Respect `prefers-reduced-motion` for any text motion.

**Avoid:** Inter/Roboto/Arial as the intentional brand face if a distinctive licensed/open alternative is available; document final choice in TECHNOLOGY_DECISIONS.

---

## 4. Spacing & layout

| Token | Value (target) |
|-------|----------------|
| `--container-width` | `1280px` (content), full-bleed dark bands |
| Section vertical padding | Generous (~64–96px desktop; reduce on mobile) |
| Navbar height | Match reference (~72–80px main bar + thin top bar) |
| Gutter | 16–24px mobile; 24–32px desktop |

### Breakpoints (test widths)

`360` · `390` · `430` · `768` · `1024` · `1280` · `1440`

### Grid behaviors

| Section | Desktop | Mobile |
|---------|---------|--------|
| Hero | ~60/40 text / founder image | Stack: text then image |
| Features + FAQ | ~65/35 | Stack features then FAQ |
| Courses | 5 columns | 2 then 1 (or horizontal scroll if needed to match reference) |
| Journey + benefits | ~70/30 | Stack |
| Testimonials | Carousel 3–4 cards | 1 card |

**No horizontal page scroll** at any tested width.

---

## 5. Radii, shadows, borders

| Token | Use |
|-------|-----|
| `--radius-sm` | Inputs, small chips |
| `--radius-md` | Buttons (pill-leaning per reference), cards |
| `--radius-lg` | Large panels |
| `--shadow-card` | Subtle elevation on light cards only |

Cards: light shadow, modest radius — **not** heavy multi-layer shadows. Hero: **no** floating badge stickers over the founder image beyond the designed quote block.

---

## 6. Components — visual rules

### Buttons

| Variant | Style |
|---------|-------|
| Primary | Solid gold, **dark navy text** (per reference), medium padding, arrow allowed |
| Secondary / ghost | Transparent, white or dark border depending on band |
| Header CTA | Compact gold, dark text, uppercase-friendly label |

All assessment primaries share destination `/free-assessment`.

### Top bar

Thin dark strip; gold-tinted icons optional; white/light social icons.

### Header

White bar, logo left (circular mark + wordmark + tagline), centered nav, CTA right. Sticky recommended.

### Hero

Dark atmospheric band; gold eyebrow; large white heading with **gold-highlighted** phrases; dual CTAs; stats row; founder portrait + quote with gold quotation mark.

### Feature cards

Dark circular icon, bold title, short muted description — **not** heavy bordered marketing cards if reference shows flat icon+text (match reference closely).

### FAQ

Accordion with separators and chevrons; accessible expand/collapse.

### Course cards

Image (fixed aspect), optional small icon, title, short text, gold “Know More →”.

### Testimonials

Dark band; white quote cards/text; gold stars; Google mark; avatar + name + designation; arrows + dots.

### Learning steps

Icon circle, STEP n, title, short copy; connected by arrows on desktop.

### Benefits list

Light surface box; checkmarks; concise bullets.

### Bottom CTA

Full-width navy bar; heading + supporting icons + large gold button + “No Obligation” line.

### Footer

Multi-column navy; logo + social; quick links; programs; contact; newsletter field + gold submit.

### WhatsApp

Fixed bottom-right green chat control; accessible label; does not block CTAs.

---

## 7. Motion

- Framer Motion for **2–3 intentional** moments: hero entrance, section fade-in on scroll, carousel transitions.  
- No animation spam.  
- `prefers-reduced-motion: reduce` → disable non-essential motion.

---

## 8. Imagery rules

| Asset | Requirement |
|-------|-------------|
| Logo / favicon | From media library |
| Founder photo | Replaceable media; do not embed screenshot of whole page |
| Course / blog images | Optimized via `next/image`; alt text required |
| Placeholders | Clearly labeled, still replaceable in admin |

**Never** use the homepage reference screenshot as live page content.

---

## 9. Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`, `section`)  
- Skip-to-content link  
- Visible focus rings  
- Keyboard FAQ, carousel, modals, mobile menu  
- Form errors announced  
- Meaningful alt text; decorative icons `aria-hidden`  

---

## 10. Admin UI (separate visual system)

Admin may use neutral dashboard primitives (sidebar, tables, forms) — clarity over marketing polish. Public site remains fully custom Tailwind matching this design system.

---

## 11. Pixel-perfect checklist (homepage)

Before calling homepage done:

- [ ] Text does not overflow  
- [ ] Cards align; course image ratios stable  
- [ ] Mobile nav works  
- [ ] Buttons readable on gold/navy  
- [ ] Images not distorted  
- [ ] No horizontal scroll  
- [ ] Section order matches § homepage structure  
- [ ] Green annotation marks absent  
- [ ] Playwright visual screenshots captured for key viewports  

---

## 12. Anti-patterns (explicit)

- Purple gradient “AI SaaS” look  
- Warm cream + terracotta broadsheet newspaper layout  
- Inset / floating hero media cards against the reference’s full-bleed dark hero  
- Dashboard clutter in the first viewport (stats stay as designed trust row only)  
- Travel UI patterns (filters for destinations, star hotels, itinerary days)
