'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  CinematicHero,
  Container,
  DisplayHeading,
  Eyebrow,
  GoldRule,
  MarqueeStrip,
} from '@/components/marketing/layout';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { bookAssessmentHref, programs } from '@/data/homepage';
import type { CmsCourse } from '@/lib/cms-types';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/cn';

function coverFor(course: CmsCourse) {
  const fromCms = resolveMediaUrl(
    course.featuredImage?.publicUrl || course.featuredImage?.url,
  );
  if (fromCms) return fromCms;
  return (
    programs.find((p) => p.slug === course.slug)?.image ||
    '/brand/hero-bg.png'
  );
}

export function CoursesIndexView({ courses }: { courses: CmsCourse[] }) {
  return (
    <>
      <CinematicHero
        media="hero"
        eyebrow="Programs"
        title={
          <>
            Courses built for{' '}
            <span className="text-[var(--color-accent)]">real conversations</span>
          </>
        }
        description="Personalized one-to-one coaching to build fluency, confidence, and career-ready communication — not crowded classroom drills."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={bookAssessmentHref} variant="primary" arrow openAssessment>
            Book Free Assessment
          </ButtonLink>
          <ButtonLink href="#catalog" variant="ghost-light">
            Browse catalog
          </ButtonLink>
        </div>
      </CinematicHero>

      <MarqueeStrip
        items={[
          'Spoken English',
          'IELTS',
          'Professional Communication',
          'Personality Development',
          'Spoken Hindi',
          '1:1 Mentorship',
        ]}
      />

      <section id="catalog" className="scroll-mt-28 bg-[var(--color-surface)] py-20 sm:py-28">
        <Container>
          <div className="mb-14 max-w-2xl">
            <GoldRule className="mb-5" />
            <Eyebrow tone="dark">Catalog</Eyebrow>
            <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
              Choose the path that matches your next goal
            </DisplayHeading>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {courses.map((course, index) => {
              const cover = coverFor(course);
              const featured = index === 0;
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className={cn(
                    'group relative overflow-hidden rounded-[2rem] bg-[var(--color-primary-dark)] text-white shadow-[var(--shadow-elevated)]',
                    featured && 'lg:col-span-2 lg:min-h-[28rem]',
                  )}
                >
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes={featured ? '100vw' : '(max-width: 1024px) 100vw, 50vw'}
                    className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)] via-[var(--color-primary-dark)]/55 to-transparent" />
                  <div
                    className={cn(
                      'relative flex h-full flex-col justify-end p-7 sm:p-10',
                      featured ? 'min-h-[22rem] lg:min-h-[28rem]' : 'min-h-[20rem]',
                    )}
                  >
                    <span className="mb-4 font-[family-name:var(--font-signature)] text-5xl leading-none text-[var(--color-accent)]/50 transition-colors group-hover:text-[var(--color-accent)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2
                          className={cn(
                            'font-display font-extrabold tracking-tight',
                            featured ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl',
                          )}
                        >
                          {course.name}
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
                          {course.shortDescription}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                          {course.mode ? (
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                              {course.mode}
                            </span>
                          ) : null}
                          {course.duration ? (
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                              {course.duration}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-[var(--color-primary-dark)] transition-transform group-hover:scale-110">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {courses.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">No published courses yet.</p>
          ) : null}
        </Container>
      </section>
    </>
  );
}
