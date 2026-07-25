'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Check,
  ChevronDown,
  Headphones,
  Mic,
  PenLine,
  Star,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RichHtml } from '@/components/marketing/RichHtml';
import {
  Container,
  DisplayHeading,
  Eyebrow,
  FinalCtaBand,
  GoldRule,
  MarqueeStrip,
  PremiumPanel,
} from '@/components/marketing/layout';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref, programs, siteContact } from '@/data/homepage';
import type { CmsCourse, CmsTestimonial } from '@/lib/cms-types';
import { resolveMediaUrl } from '@/lib/media-url';
import { htmlToPlainText } from '@/lib/public-cms';
import { cn } from '@/lib/cn';

const MODULE_ICONS: Record<string, LucideIcon> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenLine,
  speaking: Mic,
};

function moduleIcon(iconKey: string | null | undefined, title: string): LucideIcon {
  const key = (iconKey || '').toLowerCase();
  if (key && MODULE_ICONS[key]) return MODULE_ICONS[key];
  const t = title.toLowerCase();
  if (t.includes('listen')) return Headphones;
  if (t.includes('read')) return BookOpen;
  if (t.includes('writ')) return PenLine;
  if (t.includes('speak')) return Mic;
  return Target;
}

function matchesCourseLabel(label: string | null, course: CmsCourse) {
  if (!label) return true;
  const hay = label.toLowerCase();
  const name = course.name.toLowerCase();
  const slug = course.slug.toLowerCase().replace(/-/g, ' ');
  return (
    hay.includes(name) ||
    name.includes(hay) ||
    hay.includes(slug) ||
    slug.split(' ').some((part) => part.length > 3 && hay.includes(part))
  );
}

function courseCover(slug: string, featuredUrl?: string | null) {
  if (featuredUrl) return featuredUrl;
  return programs.find((p) => p.slug === slug)?.image || '/brand/hero-bg.png';
}

export function CoursePageView({
  course,
  testimonials,
}: {
  course: CmsCourse;
  testimonials: CmsTestimonial[];
}) {
  const [openModule, setOpenModule] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const courseTestimonials = testimonials.filter((t) =>
    matchesCourseLabel(t.courseLabel, course),
  );
  const shownTestimonials =
    courseTestimonials.length > 0 ? courseTestimonials : testimonials.slice(0, 3);

  const faqItems = (course.faqs || []).map((f) => ({
    question: f.question,
    answer: htmlToPlainText(f.answerHtml),
  }));

  const primaryCtaHref = course.ctaHref || bookAssessmentHref;
  const primaryCtaLabel = course.ctaLabel || 'Book Free Assessment';
  const stickyLabel = course.stickyCtaLabel || primaryCtaLabel;
  const secondaryFinalLabel = course.finalSecondaryCtaLabel || 'Talk to an Expert';
  const brochureUrl = resolveMediaUrl(
    course.brochureMedia?.publicUrl || course.brochureMedia?.url,
  );
  const secondaryHref = brochureUrl || course.secondaryCtaHref || '#curriculum';
  const cover = courseCover(
    course.slug,
    resolveMediaUrl(course.featuredImage?.publicUrl || course.featuredImage?.url),
  );

  return (
    <>
      <section className="premium-grain relative min-h-[85vh] overflow-hidden bg-[var(--color-primary-dark)] text-white lg:min-h-[92vh]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-dark)]/90 to-[var(--color-primary-dark)]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)] via-transparent to-[var(--color-primary-dark)]/55" />
        </div>

        <Container className="relative flex min-h-[85vh] flex-col justify-end pb-16 pt-28 sm:pb-20 sm:pt-32 lg:min-h-[92vh] lg:pb-28">
          <MotionReveal variants={fadeUp} className="max-w-3xl">
            <GoldRule className="mb-6" />
            <Eyebrow>{course.name}</Eyebrow>
            <DisplayHeading className="mt-4 text-white">
              {course.heroHeadline || course.shortDescription}
            </DisplayHeading>
            {course.longDescriptionHtml ? (
              <div className="mt-6 max-w-2xl [&_.rich-html]:text-white/75">
                <RichHtml html={course.longDescriptionHtml} />
              </div>
            ) : null}
            <div className="mt-7 flex flex-wrap gap-2">
              {course.mode ? (
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  {course.mode}
                </span>
              ) : null}
              {course.duration ? (
                <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
                  {course.duration}
                </span>
              ) : null}
              <span className="rounded-full border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/15 px-4 py-1.5 text-xs font-semibold text-[var(--color-accent)]">
                1:1 mentorship
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={primaryCtaHref} variant="primary" arrow openAssessment>
                {primaryCtaLabel}
              </ButtonLink>
              {course.secondaryCtaLabel ? (
                <ButtonLink href={secondaryHref} variant="ghost-light">
                  {course.secondaryCtaLabel}
                </ButtonLink>
              ) : null}
            </div>
          </MotionReveal>
        </Container>
      </section>

      <MarqueeStrip
        items={[
          'Personalized pacing',
          'Live feedback',
          'Career-ready practice',
          'Flexible scheduling',
          course.name,
        ]}
      />

      {course.whyLearnHtml ? (
        <section className="bg-white py-20 sm:py-28">
          <Container className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <GoldRule className="mb-5" />
              <Eyebrow tone="dark">Why this course</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                {course.whyLearnTitle || `Why Choose ${course.name}?`}
              </DisplayHeading>
            </div>
            <RichHtml
              html={course.whyLearnHtml}
              className="text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
            />
          </Container>
        </section>
      ) : null}

      {course.whoShouldJoinHtml ? (
        <section className="bg-[var(--color-surface)] py-20 sm:py-24">
          <Container>
            <GoldRule className="mb-5" />
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              {course.whoShouldJoinTitle || 'Who Should Join This Course?'}
            </DisplayHeading>
            {course.whoShouldJoinIntro ? (
              <p className="mt-4 max-w-2xl text-[var(--color-muted)]">{course.whoShouldJoinIntro}</p>
            ) : null}
            <div className="mt-10">
              <RichHtml
                html={course.whoShouldJoinHtml}
                className="[&_ul]:grid [&_ul]:gap-3 sm:[&_ul]:grid-cols-2 lg:[&_ul]:grid-cols-3 [&_li]:ml-0 [&_li]:list-none [&_li]:rounded-full [&_li]:bg-[var(--color-primary)] [&_li]:px-5 [&_li]:py-2.5 [&_li]:text-sm [&_li]:font-semibold [&_li]:text-white"
              />
            </div>
          </Container>
        </section>
      ) : null}

      {course.curriculumItems?.length ? (
        <section id="curriculum" className="scroll-mt-28 bg-white py-20 sm:py-28">
          <Container>
            <div className="mb-12 max-w-2xl">
              <GoldRule className="mb-5" />
              <Eyebrow tone="dark">Curriculum</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                {course.curriculumTitle || 'What You Will Learn'}
              </DisplayHeading>
            </div>
            <div className="space-y-3">
              {course.curriculumItems.map((mod, i) => {
                const open = openModule === i;
                const Icon = moduleIcon(mod.iconKey, mod.title);
                return (
                  <div
                    key={mod.id}
                    className={cn(
                      'overflow-hidden rounded-[1.5rem] border transition-colors',
                      open
                        ? 'border-[var(--color-accent)]/40 bg-[var(--color-surface)] shadow-[var(--shadow-card)]'
                        : 'border-[var(--color-border)] bg-white hover:border-[var(--color-accent)]/25',
                    )}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                      aria-expanded={open}
                      onClick={() => setOpenModule(open ? -1 : i)}
                    >
                      <span className="flex items-center gap-4">
                        <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-accent)]">
                          <Icon className="size-5" />
                        </span>
                        <span>
                          <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                            Module {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-base font-bold text-[var(--color-primary)] sm:text-lg">
                            {mod.title}
                          </span>
                        </span>
                      </span>
                      <ChevronDown
                        className={cn(
                          'size-5 shrink-0 text-[var(--color-accent)] transition-transform',
                          open && 'rotate-180',
                        )}
                      />
                    </button>
                    {open && mod.bodyHtml ? (
                      <div className="border-t border-[var(--color-border)] px-5 pb-6 pt-4 sm:px-7 sm:pl-[4.75rem]">
                        <RichHtml html={mod.bodyHtml} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {course.features?.length ? (
        <section className="bg-[var(--color-primary)] py-20 text-white sm:py-28">
          <Container>
            <DisplayHeading as="h2" className="mb-12 text-center text-white">
              {course.featuresTitle || 'Course Features'}
            </DisplayHeading>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {course.features.map((f) => (
                <li key={f.id}>
                  <PremiumPanel className="h-full">
                    <Target className="mb-4 size-5 text-[var(--color-accent)]" />
                    <h3 className="font-display text-lg font-bold">{f.title}</h3>
                    {f.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{f.description}</p>
                    ) : null}
                  </PremiumPanel>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {course.learningSteps?.length ? (
        <section className="bg-[var(--color-surface)] py-20 sm:py-28">
          <Container>
            <DisplayHeading as="h2" className="mb-12 text-center text-[var(--color-primary)]">
              {course.learningStepsTitle || 'Our Teaching Method'}
            </DisplayHeading>
            <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {course.learningSteps.map((step) => (
                <li
                  key={step.id}
                  className="relative rounded-[1.75rem] bg-white p-6 pt-10 shadow-[var(--shadow-card)]"
                >
                  <span className="absolute -top-3 left-6 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-bold text-white shadow-[var(--shadow-glow-gold)]">
                    Step {step.stepNumber}
                  </span>
                  <h3 className="font-display font-bold text-[var(--color-primary)]">{step.title}</h3>
                  {step.description ? (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{step.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </Container>
        </section>
      ) : null}

      {course.whyChooseHtml ? (
        <section className="bg-white py-20 sm:py-24">
          <Container className="max-w-3xl">
            <GoldRule className="mb-5" />
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              {course.whyChooseTitle || 'Why Choose YogiSpeaks?'}
            </DisplayHeading>
            <RichHtml html={course.whyChooseHtml} className="mt-6 text-[var(--color-muted)]" />
          </Container>
        </section>
      ) : null}

      {course.benefits?.length ? (
        <section className="bg-[var(--color-surface)] py-20 sm:py-24">
          <Container>
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              {course.benefitsTitle || 'Course Benefits'}
            </DisplayHeading>
            {course.benefitsIntro ? (
              <p className="mt-3 max-w-2xl text-[var(--color-muted)]">{course.benefitsIntro}</p>
            ) : null}
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {course.benefits.map((b) => (
                <li
                  key={b.id}
                  className="flex items-start gap-3 rounded-[1.25rem] bg-white px-5 py-4 shadow-[var(--shadow-card)]"
                >
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Check className="size-4" />
                  </span>
                  <span className="font-display font-semibold text-[var(--color-text)]">{b.label}</span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {shownTestimonials.length ? (
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <DisplayHeading as="h2" className="mb-12 text-center text-[var(--color-primary)]">
              {course.testimonialsTitle || 'Student Success Stories'}
            </DisplayHeading>
            <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory">
              {shownTestimonials.map((t) => (
                <blockquote
                  key={t.id}
                  className="min-w-[85%] snap-start rounded-[1.75rem] bg-[var(--color-primary-dark)] p-7 text-white shadow-[var(--shadow-elevated)] sm:min-w-[360px]"
                >
                  <span className="font-[family-name:var(--font-signature)] text-5xl leading-none text-[var(--color-accent)]">
                    “
                  </span>
                  <div className="-mt-2 mb-3 flex gap-0.5 text-[var(--color-accent)]">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-white/85">{t.review}</p>
                  <footer className="mt-5 border-t border-white/10 pt-4 text-sm font-semibold">
                    {t.studentName}
                    <span className="mt-1 block text-xs font-normal text-white/55">
                      {t.designation}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {faqItems.length ? (
        <section className="bg-[var(--color-surface)] py-20 sm:py-24">
          <Container className="max-w-3xl">
            <DisplayHeading as="h2" className="mb-10 text-[var(--color-primary)]">
              {course.faqsTitle || 'Frequently Asked Questions'}
            </DisplayHeading>
            <FaqAccordion items={faqItems} />
          </Container>
        </section>
      ) : null}

      <section className="border-y border-[var(--color-border)] bg-white py-12">
        <Container className="flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={primaryCtaHref} variant="primary" arrow openAssessment>
            {primaryCtaLabel}
          </ButtonLink>
        </Container>
      </section>

      <FinalCtaBand
        title={course.finalCtaHeadline || 'Ready to Get Started?'}
        body={course.finalCtaBody || undefined}
        primary={{ href: primaryCtaHref, label: primaryCtaLabel, openAssessment: true }}
        secondary={{ href: siteContact.whatsapp, label: secondaryFinalLabel }}
      />

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 p-3 backdrop-blur transition-transform lg:hidden',
          stickyVisible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <ButtonLink href={primaryCtaHref} variant="primary" className="w-full" openAssessment>
          {stickyLabel}
        </ButtonLink>
      </div>
    </>
  );
}
