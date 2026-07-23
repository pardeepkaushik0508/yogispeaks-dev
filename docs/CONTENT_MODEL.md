# YogiSpeaks — Content Model

This document maps every public surface to structured CMS fields. Content is never hard-coded in production components; components receive typed props from the NestJS public API.

**Domain:** Communication coaching only. No travel packages, destinations, hotels, flights, or itineraries.

---

## 1. Global site settings

| Field | Type | Notes |
|-------|------|-------|
| businessName | string | Default: `YogiSpeaks` |
| tagline | string | e.g. `Confidence to Communicate` |
| logoMediaId | media ref | Circular YS logo |
| faviconMediaId | media ref | YS monogram preferred |
| brandPrimary | hex | Navy |
| brandPrimaryDark | hex | Near-black navy |
| brandSecondary / accent | hex | Gold |
| brandBackground / surface / text / muted | hex | Design tokens |
| fontHeading / fontBody | string | CSS font family names |
| phone / whatsapp / email | string | Top bar + contact |
| officeAddress | text | Footer / contact |
| googleMapsUrl / googleMapsEmbed | url / text | Contact page |
| businessHours | string / JSON | e.g. Mon–Sat hours |
| socialLinks | JSON | facebook, instagram, youtube, linkedin, whatsapp |
| defaultSeo | SEO object | Title template, description, OG image |
| googleBusinessProfileUrl | url | Reviews section |
| googleReviewsUrl | url | Optional deep link |

Brand colors are exposed to the frontend as validated CSS variables at runtime (no rebuild required).

---

## 2. Header & navigation

### Top bar

| Field | Notes |
|-------|-------|
| showTopBar | boolean |
| phoneLabel / phoneValue | Display + tel: link |
| emailLabel / emailValue | mailto: |
| socialVisibility | per-network enable |

### Main navigation

`NavigationItem` tree:

| Field | Notes |
|-------|-------|
| label | e.g. Home, About, Courses |
| href | Internal path or external URL |
| location | `HEADER` \| `FOOTER_QUICK` \| `FOOTER_PROGRAMS` |
| parentId | Nullable — dropdown children |
| sortOrder | dnd-kit reorder |
| isVisible | soft hide |
| openInNewTab | boolean |

### Header CTA

| Field | Default (from reference) |
|-------|--------------------------|
| label | `BOOK FREE ASSESSMENT` |
| href | `/free-assessment` |
| isVisible | true |

---

## 3. Homepage sections

Each section has: `key`, `title`, `subtitle`, `isVisible`, `sortOrder`, optional rich body, optional media.

### 3.1 Hero (`HERO`)

| Field | Example from reference |
|-------|------------------------|
| eyebrow | Helping Students & Professionals |
| headingLine1 | Transform the Way You Communicate. |
| headingLine2 | Build Confidence. *(gold highlight)* |
| headingLine3 | Advance Your Career. *(gold highlight)* |
| highlightPhrases | JSON array of substrings to style gold |
| description | Personalized one-to-one coaching… |
| founderImageId | Media — replaceable |
| founderQuote | Communication is not just a skill… |
| founderQuoteAttribution | Yoginder / Yogender, Coach & Founder *(confirm legal spelling with client)* |
| primaryCtaLabel / primaryCtaHref | Book Your Free Communication Assessment → /free-assessment |
| secondaryCtaLabel / secondaryCtaHref | Explore Our Programs → /courses |

### 3.2 Statistics (`STATS`)

Repeatable `HomepageStat`:

| Value | Label |
|-------|-------|
| 15+ | Years of Experience |
| 5000+ | Learners Coached |
| 150+ | Verified Reviews |
| — | Trusted by Students Across India & Internationally *(badge)* |

### 3.3 Why choose us (`FEATURES`)

Section heading: e.g. *Personalized Guidance. Real Results.*

Six `Feature` records (seed from reference):

1. Personalized Coaching  
2. Practical Communication  
3. Flexible Scheduling  
4. Structured Learning  
5. Continuous Feedback  
6. Dedicated Support  

Fields: `title`, `description`, `iconKey` or `iconMediaId`, `sortOrder`, `isVisible`.

### 3.4 FAQs on homepage (`FAQS`)

Featured FAQs (`showOnHomepage=true`) with accordion answers. Full FAQ list on dedicated area / “View All FAQs” target.

Seed questions (from reference):

- Who can join YogiSpeaks?  
- Is this course suitable for beginners?  
- Are classes online or offline?  
- Do you provide study materials?  
- Will I receive a certificate?  
- How long does it take to see improvement?  
- Can I choose my class timing?  
- Do you help with interview preparation?  
- How do I enroll / book an assessment?  

### 3.5 Programs (`COURSES_FEATURED`)

Featured published courses (`isFeatured=true`), display order. Card: image, title, short description, `Know More →`.

Seed courses:

1. Spoken English  
2. IELTS Preparation  
3. Professional Communication  
4. Personality Development  
5. Spoken Hindi  

### 3.6 Testimonials (`TESTIMONIALS`)

Carousel of visible testimonials; Google flag + optional review URL.

### 3.7 Learning journey (`LEARNING_STEPS`)

Five steps:

1. Communication Assessment  
2. Personalized Learning Plan  
3. Learn Through Practice  
4. Track Your Progress  
5. Achieve Your Goals  

### 3.8 Benefits (`BENEFITS`)

“What You Get at YogiSpeaks” checklist (seed examples):

- 1-to-1 Live Online Classes  
- Real-life Speaking Practice  
- Personalized Feedback  
- Flexible Scheduling  
- Study Materials  
- Lifetime Guidance & Support  

### 3.9 Bottom CTA (`BOTTOM_CTA`)

| Field | Example |
|-------|---------|
| heading | Ready to Transform Your Communication? |
| description | Take the first step… |
| highlightItems | Free Communication Assessment; Personalized Learning Plan |
| ctaLabel / ctaHref | Book… → /free-assessment |
| reassurance | No Obligation – 100% Free |

### 3.10 Newsletter (`NEWSLETTER`)

Heading, description, success/error copy — also used in footer “Stay Connected”.

---

## 4. Courses

| Field | TinyMCE? |
|-------|----------|
| name, slug | No |
| shortDescription | No (one-line / short) |
| longDescription | **Yes** |
| featuredImage, gallery | Media |
| duration, mode | No |
| feeAmount, feeCurrency, feeDisplayEnabled | No |
| benefits | Structured list (`CourseBenefit`) | No |
| curriculum / eligibility / whoShouldJoin | Multi-paragraph HTML | **Yes** |
| ctaLabel, ctaHref | No |
| SEO object | No |
| status: DRAFT / PUBLISHED | — |
| isFeatured, sortOrder, deletedAt | — |

---

## 5. Blog

| Field | TinyMCE? |
|-------|----------|
| title, slug, excerpt | No |
| body | **Yes** |
| categoryId, authorName | No |
| featuredImage | Media |
| SEO, status, publishedAt | — |

---

## 6. Testimonials

`studentName`, `studentImage`, `designation`, `courseLabel`, `review` (plain or limited rich), `rating` (1–5), `isGoogleReview`, `reviewUrl`, `isVisible`, `sortOrder`.

---

## 7. FAQs

`question`, `answer` (**Yes** if formatted), `category`, `showOnHomepage`, `isVisible`, `sortOrder`.

---

## 8. Pages (About, Reviews intro, Contact intro, legal)

| Field | TinyMCE? |
|-------|----------|
| title, slug | No |
| body | **Yes** |
| heroImage | Media |
| SEO | No |
| status | DRAFT / PUBLISHED |

Legal slugs: `privacy-policy`, `terms-and-conditions`, `refund-policy`, `disclaimer`.

---

## 9. Enquiries (assessment + contact)

Shared `Inquiry` with `type`: `ASSESSMENT` | `CONTACT`.

Assessment fields:

- fullName, email, mobile, whatsapp  
- interestedCourseId / interestedCourseLabel  
- communicationLevel, learningGoal  
- preferredTiming, preferredContactMethod  
- message, consentAccepted  
- status: NEW | CONTACTED | QUALIFIED | ENROLLED | CLOSED | SPAM  
- admin notes (`InquiryNote`)  
- CSV export  

Anti-spam: rate limit + honeypot / timestamp token (implementation detail in API).

---

## 10. Newsletter

`email`, `status` (ACTIVE / UNSUBSCRIBED), `subscribedAt`, source page, export.

---

## 11. Email templates

Keys: `assessment_confirmation`, `contact_confirmation`, `admin_enquiry_notification`, `newsletter_welcome`, `password_reset`.

Bodies use TinyMCE with safe merge-tag placeholders (`{{fullName}}`, `{{resetUrl}}`, etc.).

---

## 12. SEO object (reusable)

Embedded on pages, courses, blogs, and defaults:

- metaTitle, metaDescription  
- canonicalUrl  
- ogTitle, ogDescription, ogImageId  
- robotsIndex, robotsFollow  

Rendered via Next.js Metadata API + JSON-LD (Organization, LocalBusiness/coaching, Course, BlogPosting, FAQPage, BreadcrumbList).

---

## 13. Media

Every public image: URL, alt, title/caption, mime, size, width/height, folder/tags, createdBy. Replaceable from Media Library without code changes.

---

## 14. Content seed strategy

1. Seed from homepage reference transcription + content-required checklist structure.  
2. Super-admin from `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` env only.  
3. Legal pages: clear placeholders if client text missing.  
4. No lorem ipsum when reference copy exists.  
5. No travel-package seed data of any kind.

---

## 15. TinyMCE usage matrix

| Use TinyMCE | Do not use TinyMCE |
|-------------|--------------------|
| Course long description, curriculum, eligibility sections | Names, titles, labels, slugs |
| Blog body, page/legal body | Phone, email, one-line descriptions |
| FAQ answers (when formatted) | Button labels, numeric fields |
| Email template body | Nav labels, stats values |
| Homepage long descriptions if needed | |

Backend sanitize-html allowlist on save; frontend `SafeHtml` only on sanitized strings.
