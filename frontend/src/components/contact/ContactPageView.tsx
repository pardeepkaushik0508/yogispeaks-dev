'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RichHtml } from '@/components/marketing/RichHtml';
import {
  AmbientMesh,
  Container,
  DisplayHeading,
  Eyebrow,
  FinalCtaBand,
  GoldRule,
} from '@/components/marketing/layout';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref, programs, siteContact } from '@/data/homepage';
import type { CmsCourse, CmsPage } from '@/lib/cms-types';
import {
  asBlockMeta,
  asCtaMeta,
  asItemList,
  getPageBlock,
  submitInquiry,
} from '@/lib/public-cms';
import { ApiError } from '@/lib/api-client';
import { cn } from '@/lib/cn';

const LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];

const TIMING_OPTIONS = [
  'Morning (8 AM – 12 PM IST)',
  'Afternoon (12 PM – 5 PM IST)',
  'Evening (5 PM – 9 PM IST)',
  'Weekends only',
  'Flexible / to be discussed',
];

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name').max(80),
  email: z.string().trim().email('Please enter a valid email'),
  mobile: z
    .string()
    .trim()
    .min(10, 'Enter a valid mobile number')
    .max(15)
    .regex(/^[+]?[\d\s-]{10,15}$/, 'Enter a valid mobile number'),
  country: z.string().trim().min(2, 'Please enter your country').max(80),
  preferredCourse: z.string().trim().min(1, 'Please select a course'),
  currentLevel: z.string().trim().min(1, 'Please select your current level'),
  preferredTiming: z.string().trim().min(1, 'Please select preferred timing'),
  learningGoal: z.string().trim().min(10, 'Please describe your learning goals').max(500),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function fieldClass(hasError: boolean) {
  return cn(
    'w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-[var(--color-text)] transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
    hasError ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)]',
  );
}

export function ContactPageView({
  page,
  courses,
}: {
  page: CmsPage;
  courses: CmsCourse[];
}) {
  const [stickyVisible, setStickyVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const hero = getPageBlock(page, 'hero');
  const heroMeta = asBlockMeta(hero?.itemsJson);
  const getInTouch = getPageBlock(page, 'get_in_touch');
  const touchMeta = asBlockMeta(getInTouch?.itemsJson);
  const formIntro = getPageBlock(page, 'form_intro');
  const whyContact = getPageBlock(page, 'why_contact');
  const faqs = getPageBlock(page, 'faqs');
  const location = getPageBlock(page, 'location');
  const cta = getPageBlock(page, 'cta');
  const ctaMeta = asCtaMeta(cta?.itemsJson);
  const conversion = getPageBlock(page, 'conversion');
  const conversionMeta = asCtaMeta(conversion?.itemsJson);

  const courseOptions =
    courses.length > 0
      ? courses.map((c) => ({ value: c.name, label: c.name }))
      : programs.map((p) => ({ value: p.title, label: p.title }));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      country: '',
      preferredCourse: '',
      currentLevel: '',
      preferredTiming: '',
      learningGoal: '',
    },
  });

  useEffect(() => {
    const onScroll = () => setStickyVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const faqItems = asItemList(faqs?.itemsJson).map((item) => ({
    question: item.title,
    answer: item.description || '',
  }));

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('');
    try {
      await submitInquiry({
        ...values,
        type: 'ASSESSMENT',
        sourcePage: 'contact',
      });
      setSubmitted(true);
      reset();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    }
  });

  const contactRows = [
    {
      icon: MapPin,
      label: 'Office',
      value: touchMeta.office || siteContact.address,
      href: undefined as string | undefined,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: touchMeta.phone || siteContact.phone,
      href: siteContact.phoneHref,
    },
    {
      icon: Mail,
      label: 'Email',
      value: touchMeta.email || siteContact.email,
      href: siteContact.emailHref,
    },
    {
      icon: Clock,
      label: 'Hours',
      value: [touchMeta.hoursWeekday || siteContact.hours, touchMeta.hoursSunday]
        .filter(Boolean)
        .join(' · '),
      href: undefined,
    },
  ];

  return (
    <>
      <section className="premium-grain relative overflow-hidden bg-[var(--color-surface)]">
        <AmbientMesh variant="light" />
        <Container className="relative grid gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-0 lg:py-0">
          <MotionReveal
            variants={fadeUp}
            className="flex flex-col justify-center py-6 lg:py-24 lg:pr-14"
          >
            <GoldRule className="mb-6" />
            <Eyebrow>{hero?.title || page.title}</Eyebrow>
            <DisplayHeading className="mt-4 text-[var(--color-primary)]">
              {hero?.subtitle || 'Let’s plan your next conversation milestone'}
            </DisplayHeading>
            {hero?.bodyHtml ? (
              <div className="mt-5 [&_.rich-html]:text-[var(--color-muted)]">
                <RichHtml html={hero.bodyHtml} />
              </div>
            ) : (
              <p className="mt-5 max-w-md text-[var(--color-muted)]">
                Tell us your goals — a mentor will help you choose the right coaching path.
              </p>
            )}

            <ul className="mt-12 space-y-5">
              {contactRows.map((row) => {
                const Icon = row.icon;
                return (
                  <li key={row.label} className="flex gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-accent)] shadow-[var(--shadow-card)]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                        {row.label}
                      </p>
                      {row.href ? (
                        <a
                          href={row.href}
                          className="mt-1 block font-display text-base font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)]"
                        >
                          {row.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-display text-base font-semibold text-[var(--color-primary)]">
                          {row.value}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href={bookAssessmentHref} variant="primary" arrow openAssessment>
                {heroMeta.primaryLabel || 'Book Free Assessment'}
              </ButtonLink>
              <ButtonLink href={siteContact.whatsapp} variant="ghost-dark">
                {heroMeta.secondaryLabel || 'Chat on WhatsApp'}
              </ButtonLink>
            </div>
          </MotionReveal>

          <div className="relative lg:-mr-8 lg:bg-[var(--color-primary-dark)] lg:px-10 lg:py-20 xl:px-14">
            <AmbientMesh variant="gold" />
            <div className="premium-shine relative rounded-[2rem] bg-white p-6 shadow-[var(--shadow-elevated)] sm:p-9 lg:rounded-[2.25rem]">
              <Eyebrow tone="dark">Enquiry</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                {formIntro?.title || 'Book Your Free Communication Assessment'}
              </DisplayHeading>
              {formIntro?.subtitle ? (
                <p className="mt-3 text-sm text-[var(--color-muted)]">{formIntro.subtitle}</p>
              ) : (
                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  Share a few details and we’ll reach out within one business day.
                </p>
              )}

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-[var(--color-surface)] p-8 text-center">
                  <h3 className="text-xl font-bold text-[var(--color-primary)]">Thank you!</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Your enquiry has been received. We&apos;ll contact you soon.
                  </p>
                  <button
                    type="button"
                    className="mt-6 text-sm font-semibold text-[var(--color-accent)] hover:underline"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-6" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Full name *
                      </label>
                      <input id="fullName" className={fieldClass(!!errors.fullName)} {...register('fullName')} />
                      {errors.fullName ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.fullName.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Email *
                      </label>
                      <input id="email" type="email" className={fieldClass(!!errors.email)} {...register('email')} />
                      {errors.email ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.email.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Mobile *
                      </label>
                      <input id="mobile" type="tel" className={fieldClass(!!errors.mobile)} {...register('mobile')} />
                      {errors.mobile ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.mobile.message}</p>
                      ) : null}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="country" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Country *
                      </label>
                      <input id="country" className={fieldClass(!!errors.country)} {...register('country')} />
                      {errors.country ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.country.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="preferredCourse" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Preferred course *
                      </label>
                      <select id="preferredCourse" className={fieldClass(!!errors.preferredCourse)} {...register('preferredCourse')}>
                        <option value="">Select a course</option>
                        {courseOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {errors.preferredCourse ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.preferredCourse.message}</p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="currentLevel" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Current level *
                      </label>
                      <select id="currentLevel" className={fieldClass(!!errors.currentLevel)} {...register('currentLevel')}>
                        <option value="">Select level</option>
                        {LEVEL_OPTIONS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.currentLevel ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.currentLevel.message}</p>
                      ) : null}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="preferredTiming" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Preferred timing *
                      </label>
                      <select id="preferredTiming" className={fieldClass(!!errors.preferredTiming)} {...register('preferredTiming')}>
                        <option value="">Select timing</option>
                        {TIMING_OPTIONS.map((timing) => (
                          <option key={timing} value={timing}>
                            {timing}
                          </option>
                        ))}
                      </select>
                      {errors.preferredTiming ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.preferredTiming.message}</p>
                      ) : null}
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="learningGoal" className="mb-1.5 block text-sm font-medium text-[var(--color-primary)]">
                        Learning goals *
                      </label>
                      <textarea
                        id="learningGoal"
                        rows={4}
                        className={cn(fieldClass(!!errors.learningGoal), 'resize-none')}
                        placeholder="Tell us what you'd like to achieve…"
                        {...register('learningGoal')}
                      />
                      {errors.learningGoal ? (
                        <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.learningGoal.message}</p>
                      ) : null}
                    </div>
                  </div>
                  {submitError ? (
                    <p className="mt-4 text-sm font-medium text-[var(--color-danger)]" role="alert">
                      {submitError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-accent)] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-70"
                  >
                    {isSubmitting ? 'Submitting…' : 'Submit enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-28">
        <Container>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <GoldRule className="mb-5" />
              <Eyebrow tone="dark">Programs</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                Explore programs
              </DisplayHeading>
            </div>
            <Link
              href="/courses"
              className="hidden text-sm font-semibold text-[var(--color-accent)] sm:inline-flex sm:items-center sm:gap-1"
            >
              All courses <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(courses.length
              ? courses.map((course) => ({
                  slug: course.slug,
                  name: course.name,
                  description: course.shortDescription,
                }))
              : programs.map((program) => ({
                  slug: program.slug,
                  name: program.title,
                  description: program.description,
                }))
            ).map((course, i) => (
              <li key={course.slug}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="premium-shine group flex h-full flex-col rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-all hover:border-[var(--color-accent)]/40 hover:bg-white hover:shadow-[var(--shadow-elevated)]"
                >
                  <span className="mb-5 font-[family-name:var(--font-signature)] text-5xl text-[var(--color-accent)]/35 transition-colors group-hover:text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[var(--color-primary)]">
                    {course.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-[var(--color-muted)]">{course.description}</p>
                  <span className="mt-5 text-sm font-bold text-[var(--color-accent)]">
                    Know more →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {whyContact ? (
        <section className="bg-[var(--color-primary)] py-14 text-white sm:py-16">
          <Container>
            <h2 className="mb-8 text-2xl font-extrabold sm:text-3xl">
              {whyContact.title || 'Why Contact YogiSpeaks?'}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {asItemList(whyContact.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {faqItems.length ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16">
          <Container className="max-w-3xl">
            <h2 className="mb-8 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              {faqs?.title || 'Frequently Asked Questions'}
            </h2>
            <FaqAccordion items={faqItems} />
          </Container>
        </section>
      ) : null}

      {location ? (
        <section className="bg-white py-14 sm:py-16">
          <Container className="max-w-3xl text-center">
            <GoldRule className="mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              {location.title || 'Serving Learners Worldwide'}
            </h2>
            {location.bodyHtml ? (
              <RichHtml html={location.bodyHtml} className="mt-4" />
            ) : null}
          </Container>
        </section>
      ) : null}

      {(cta || conversion) && (
        <FinalCtaBand
          eyebrow={cta?.title || 'Next step'}
          title={cta?.subtitle || conversion?.title || 'Ready to speak with confidence?'}
          body={!cta ? conversion?.subtitle || undefined : undefined}
          primary={{
            href: bookAssessmentHref,
            label:
              ctaMeta.buttonLabel ||
              conversionMeta.buttonLabel ||
              'Book Free Communication Assessment',
            openAssessment: true,
          }}
          secondary={{
            href: siteContact.whatsapp,
            label:
              ctaMeta.secondaryLabel ||
              conversionMeta.secondaryLabel ||
              'Chat on WhatsApp',
          }}
        />
      )}

      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-white/95 p-3 backdrop-blur transition-transform lg:hidden',
          stickyVisible ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <ButtonLink href={bookAssessmentHref} variant="primary" className="w-full" openAssessment>
          Book Free Assessment
        </ButtonLink>
      </div>
    </>
  );
}
