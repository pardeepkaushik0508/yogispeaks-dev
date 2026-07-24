'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  MessageCircle,
  Star,
  Target,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RichHtml } from '@/components/marketing/RichHtml';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref, siteContact } from '@/data/homepage';
import type { CmsCourse, CmsTestimonial } from '@/lib/cms-types';
import { htmlToPlainText } from '@/lib/public-cms';
import { cn } from '@/lib/cn';

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

  const courseTestimonials = testimonials.filter(
    (t) =>
      !t.courseLabel ||
      t.courseLabel.toLowerCase().includes('spoken') ||
      t.courseLabel.toLowerCase().includes(course.name.toLowerCase().slice(0, 8)),
  );
  const shownTestimonials =
    courseTestimonials.length > 0 ? courseTestimonials : testimonials.slice(0, 3);

  const faqItems = (course.faqs || []).map((f) => ({
    question: f.question,
    answer: htmlToPlainText(f.answerHtml),
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-on-dark)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at 70% 10%, rgba(196,155,72,0.28), transparent 45%), linear-gradient(135deg, transparent 40%, rgba(5,10,24,0.9))',
          }}
        />
        <div className="relative mx-auto max-w-[var(--container-width)] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <MotionReveal variants={fadeUp} className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {course.name}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {course.heroHeadline || course.shortDescription}
            </h1>
            {course.longDescriptionHtml ? (
              <div className="mt-6 [&_.rich-html]:text-white/85">
                <RichHtml html={course.longDescriptionHtml} />
              </div>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={course.ctaHref || bookAssessmentHref} variant="primary" arrow openAssessment>
                {course.ctaLabel || 'Book Free Communication Assessment'}
              </ButtonLink>
              {course.secondaryCtaLabel ? (
                <ButtonLink
                  href={course.secondaryCtaHref || '#curriculum'}
                  variant="ghost-light"
                >
                  {course.secondaryCtaLabel}
                </ButtonLink>
              ) : null}
            </div>
            <p className="mt-5 text-sm text-white/70">
              {course.mode}
              {course.duration ? ` · ${course.duration}` : ''}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Why learn */}
      {course.whyLearnHtml ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
              <h2 className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
                Why Learn Spoken English?
              </h2>
              <RichHtml html={course.whyLearnHtml} className="text-[var(--color-text)]" />
            </div>
          </div>
        </section>
      ) : null}

      {/* Who should join */}
      {course.whoShouldJoinHtml ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-3 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Who Should Join This Course?
            </h2>
            <p className="mb-6 text-sm text-[var(--color-muted)]">This course is ideal for:</p>
            <RichHtml html={course.whoShouldJoinHtml} className="[&_ul]:grid [&_ul]:gap-2 sm:[&_ul]:grid-cols-2 lg:[&_ul]:grid-cols-3 [&_li]:list-none [&_li]:ml-0 [&_li]:rounded-full [&_li]:border [&_li]:border-[var(--color-border)] [&_li]:bg-white [&_li]:px-4 [&_li]:py-2 [&_li]:text-sm [&_li]:font-medium [&_li]:text-[var(--color-primary)]" />
          </div>
        </section>
      ) : null}

      {/* Curriculum */}
      {course.curriculumItems?.length ? (
        <section id="curriculum" className="scroll-mt-24 bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-8 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              What You Will Learn
            </h2>
            <div className="divide-y divide-[var(--color-border)] rounded-2xl border border-[var(--color-border)]">
              {course.curriculumItems.map((mod, i) => {
                const open = openModule === i;
                return (
                  <div key={mod.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-6"
                      aria-expanded={open}
                      onClick={() => setOpenModule(open ? -1 : i)}
                    >
                      <span className="font-semibold text-[var(--color-primary)]">{mod.title}</span>
                      <ChevronDown
                        className={cn(
                          'size-5 shrink-0 text-[var(--color-accent)] transition-transform',
                          open && 'rotate-180',
                        )}
                        aria-hidden
                      />
                    </button>
                    {open && mod.bodyHtml ? (
                      <div className="px-4 pb-5 sm:px-6">
                        <RichHtml html={mod.bodyHtml} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Features */}
      {course.features?.length ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Course Features
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {course.features.map((f) => (
                <li
                  key={f.id}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-white px-4 py-3"
                >
                  <Target className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  <div>
                    <p className="font-semibold text-[var(--color-primary)]">{f.title}</p>
                    {f.description ? (
                      <p className="mt-1 text-sm text-[var(--color-muted)]">{f.description}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Benefits */}
      {course.benefits?.length ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-3 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Course Benefits
            </h2>
            <p className="mb-8 text-sm text-[var(--color-muted)]">
              After completing the course, you’ll be able to:
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {course.benefits.map((b) => (
                <li key={b.id} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  <span className="font-medium text-[var(--color-text)]">{b.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Teaching method */}
      {course.learningSteps?.length ? (
        <section className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-10 text-center text-2xl font-extrabold sm:text-3xl">
              Our Teaching Method
            </h2>
            <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {course.learningSteps.map((step) => (
                <li
                  key={step.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                    Step {step.stepNumber}
                  </span>
                  <h3 className="mt-2 font-bold">{step.title}</h3>
                  {step.description ? (
                    <p className="mt-2 text-sm text-white/75">{step.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {/* Why choose */}
      {course.whyChooseHtml ? (
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-6 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Why Choose YogiSpeaks?
            </h2>
            <RichHtml html={course.whyChooseHtml} className="text-[var(--color-text)]" />
          </div>
        </section>
      ) : null}

      {/* Testimonials */}
      {shownTestimonials.length ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Student Success Stories
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {shownTestimonials.map((t) => (
                <blockquote
                  key={t.id}
                  className="min-w-[85%] snap-start rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:min-w-[340px]"
                >
                  <div className="mb-3 flex gap-0.5 text-[var(--color-accent)]" aria-label={`${t.rating} stars`}>
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--color-text)]">
                    “{t.review}”
                  </p>
                  <footer className="mt-4 text-sm font-semibold text-[var(--color-primary)]">
                    — {t.designation}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQs */}
      {faqItems.length ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="mb-8 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <FaqAccordion items={faqItems} />
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      <section className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Start Speaking English with Confidence
          </h2>
          <p className="mt-3 text-sm text-white/80 sm:text-base">
            Take the first step toward better communication and greater opportunities.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={course.ctaHref || bookAssessmentHref} variant="primary" arrow openAssessment>
              {course.ctaLabel || 'Book Your Free Communication Assessment'}
            </ButtonLink>
            <ButtonLink href={siteContact.whatsapp} variant="ghost-light">
              <MessageCircle className="size-4" aria-hidden />
              Talk to an Expert
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 p-3 backdrop-blur transition-transform lg:hidden',
          stickyVisible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <ButtonLink
          href={course.ctaHref || bookAssessmentHref}
          variant="primary"
          className="w-full"
          openAssessment
        >
          Book Free Communication Assessment
        </ButtonLink>
      </div>
    </>
  );
}
