'use client';

import { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RichHtml } from '@/components/marketing/RichHtml';
import {
  AmbientMesh,
  AssessmentCta,
  CinematicHero,
  Container,
  DisplayHeading,
  Eyebrow,
  GoldRule,
  MarqueeStrip,
} from '@/components/marketing/layout';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref } from '@/data/homepage';
import type { CmsPage, CmsTestimonial } from '@/lib/cms-types';
import {
  asBlockMeta,
  asCtaMeta,
  asItemList,
  getPageBlock,
} from '@/lib/public-cms';
import { cn } from '@/lib/cn';

export function ReviewsPageView({
  page,
  testimonials,
}: {
  page: CmsPage;
  testimonials: CmsTestimonial[];
}) {
  const [courseFilter, setCourseFilter] = useState('All');

  const hero = getPageBlock(page, 'hero');
  const heroMeta = asBlockMeta(hero?.itemsJson);
  const whyRecommend = getPageBlock(page, 'why_recommend');
  const achievements = getPageBlock(page, 'achievements');
  const trust = getPageBlock(page, 'trust');
  const journey = getPageBlock(page, 'journey');
  const share = getPageBlock(page, 'share');
  const shareMeta = asBlockMeta(share?.itemsJson);
  const faqs = getPageBlock(page, 'faqs');
  const cta = getPageBlock(page, 'cta');
  const ctaMeta = asCtaMeta(cta?.itemsJson);
  const conversion = getPageBlock(page, 'conversion');
  const conversionMeta = asCtaMeta(conversion?.itemsJson);

  const courseLabels = useMemo(() => {
    const labels = new Set<string>();
    testimonials.forEach((t) => {
      if (t.courseLabel?.trim()) labels.add(t.courseLabel.trim());
    });
    return ['All', ...Array.from(labels).sort()];
  }, [testimonials]);

  const filtered = useMemo(() => {
    if (courseFilter === 'All') return testimonials;
    return testimonials.filter((t) => t.courseLabel === courseFilter);
  }, [courseFilter, testimonials]);

  const faqItems = asItemList(faqs?.itemsJson).map((item) => ({
    question: item.title,
    answer: item.description || '',
  }));

  const avgRating = heroMeta.ratingValue || '4.9';

  return (
    <>
      <CinematicHero
        media="hero"
        eyebrow={hero?.title || page.title}
        title={hero?.subtitle || 'Voices that prove the coaching works'}
        description={
          hero?.bodyHtml ? (
            <div className="[&_.rich-html]:text-white/75">
              <RichHtml html={hero.bodyHtml} />
            </div>
          ) : (
            'Real learners. Real interviews cleared. Real confidence on stage and on calls.'
          )
        }
      >
        <div className="flex flex-wrap items-center gap-5">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-md">
            <div className="flex gap-0.5 text-[var(--color-accent)]" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span className="font-display text-2xl font-extrabold text-white">{avgRating}</span>
            {heroMeta.ratingCount ? (
              <span className="text-sm text-white/65">{heroMeta.ratingCount} reviews</span>
            ) : null}
          </div>
          <ButtonLink href={bookAssessmentHref} variant="primary" arrow openAssessment>
            {heroMeta.primaryLabel || 'Book Free Assessment'}
          </ButtonLink>
        </div>
      </CinematicHero>

      <MarqueeStrip
        items={
          asItemList(trust?.itemsJson).map((i) => i.title).length
            ? asItemList(trust?.itemsJson).map((i) => i.title)
            : ['Trusted Mentorship', 'Flexible Timing', 'Practical Feedback', 'Career Results']
        }
      />

      {whyRecommend ? (
        <section className="bg-white py-16 sm:py-20">
          <Container className="max-w-3xl">
            <GoldRule className="mb-5" />
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              {whyRecommend.title || 'Why Our Students Recommend YogiSpeaks'}
            </DisplayHeading>
            {whyRecommend.bodyHtml ? (
              <RichHtml html={whyRecommend.bodyHtml} className="mt-6 text-[var(--color-muted)]" />
            ) : null}
          </Container>
        </section>
      ) : null}

      <section id="stories" className="scroll-mt-24 bg-[var(--color-surface)] py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow tone="dark">Testimonials</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                What Our Learners Say
              </DisplayHeading>
            </div>
            <div className="flex flex-wrap gap-2">
              {courseLabels.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setCourseFilter(label)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    courseFilter === label
                      ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]'
                      : 'bg-white text-[var(--color-primary)] ring-1 ring-[var(--color-border)] hover:ring-[var(--color-accent)]',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {filtered.map((t, index) => (
              <blockquote
                key={t.id}
                className={cn(
                  'premium-shine mb-5 break-inside-avoid rounded-[1.5rem] bg-white p-7 shadow-[var(--shadow-card)]',
                  index % 4 === 0 && 'ring-1 ring-[var(--color-accent)]/25',
                )}
              >
                <span
                  aria-hidden
                  className="block font-[family-name:var(--font-signature)] text-6xl leading-none text-[var(--color-accent)]"
                >
                  “
                </span>
                <div
                  className="-mt-3 mb-4 flex gap-0.5 text-[var(--color-accent)]"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[0.95rem] leading-relaxed text-[var(--color-text)]">{t.review}</p>
                <footer className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-display text-sm font-bold text-[var(--color-accent)]">
                    {t.studentName.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-primary)]">{t.studentName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{t.designation}</p>
                    {t.courseLabel ? (
                      <p className="mt-0.5 text-xs font-semibold text-[var(--color-accent)]">
                        {t.courseLabel}
                      </p>
                    ) : null}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
          {!filtered.length ? (
            <p className="text-center text-sm text-[var(--color-muted)]">
              No reviews found for this course yet.
            </p>
          ) : null}
          <div className="mt-14">
            <AssessmentCta />
          </div>
        </Container>
      </section>

      {achievements ? (
        <section className="bg-white py-20">
          <Container>
            <DisplayHeading as="h2" className="mb-10 text-[var(--color-primary)]">
              {achievements.title || 'Student Achievements'}
            </DisplayHeading>
            <ul className="grid gap-3 sm:grid-cols-2">
              {asItemList(achievements.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl bg-[var(--color-primary)] px-5 py-4 text-sm font-semibold text-white"
                >
                  <Star className="size-4 shrink-0 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                  {item.title}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {journey ? (
        <section className="relative overflow-hidden bg-[var(--color-surface)] py-20 sm:py-28">
          <AmbientMesh variant="light" />
          <Container className="relative">
            <GoldRule className="mb-5" />
            <DisplayHeading as="h2" className="mb-12 text-[var(--color-primary)]">
              {journey.title || 'Learning Journey'}
            </DisplayHeading>
            <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {asItemList(journey.itemsJson).map((item, i) => (
                <li key={item.title} className="relative rounded-[1.5rem] bg-white p-6 pt-12 shadow-[var(--shadow-card)]">
                  <span className="absolute left-6 top-0 -translate-y-1/2 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white">
                    Step {i + 1}
                  </span>
                  <h3 className="font-display font-bold text-[var(--color-primary)]">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {share ? (
        <section className="bg-white py-20">
          <Container className="max-w-3xl text-center">
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              {share.title || 'Share Your Experience'}
            </DisplayHeading>
            {share.bodyHtml ? (
              <RichHtml html={share.bodyHtml} className="mt-4 text-left sm:text-center" />
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {shareMeta.primaryLabel ? (
                <ButtonLink href={shareMeta.primaryHref || '#'} variant="primary">
                  {shareMeta.primaryLabel}
                </ButtonLink>
              ) : null}
              {shareMeta.secondaryLabel ? (
                <ButtonLink href={shareMeta.secondaryHref || '/contact'} variant="ghost-dark">
                  {shareMeta.secondaryLabel}
                </ButtonLink>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {faqItems.length ? (
        <section className="bg-[var(--color-surface)] py-20">
          <Container className="max-w-3xl">
            <DisplayHeading as="h2" className="mb-10 text-[var(--color-primary)]">
              {faqs?.title || 'Frequently Asked Questions'}
            </DisplayHeading>
            <FaqAccordion items={faqItems} />
          </Container>
        </section>
      ) : null}

      {(cta || conversion?.title) && (
        <section className="premium-grain relative overflow-hidden bg-[var(--color-primary-dark)] py-20 text-white sm:py-28">
          <Container className="relative max-w-3xl text-center">
            <Eyebrow>{cta?.title || 'Next chapter'}</Eyebrow>
            <DisplayHeading as="h2" className="mt-4 text-white">
              {cta?.subtitle || conversion?.title || 'Your success story could be next'}
            </DisplayHeading>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href={ctaMeta.buttonHref || conversionMeta.buttonHref || bookAssessmentHref}
                variant="primary"
                arrow
                openAssessment
              >
                {ctaMeta.buttonLabel ||
                  conversionMeta.buttonLabel ||
                  'Book Free Communication Assessment'}
              </ButtonLink>
              {(ctaMeta.secondaryLabel || conversionMeta.secondaryLabel) && (
                <ButtonLink
                  href={ctaMeta.secondaryHref || conversionMeta.secondaryHref || '/contact'}
                  variant="ghost-light"
                >
                  {ctaMeta.secondaryLabel || conversionMeta.secondaryLabel}
                </ButtonLink>
              )}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
