import type { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { fetchPublishedCourses } from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Online Communication Courses | YogiSpeaks',
  description:
    'Explore Spoken English, IELTS, Professional Communication, Personality Development, and Spoken Hindi courses at YogiSpeaks.',
  alternates: { canonical: `${siteUrl}/courses` },
};

export default async function CoursesIndexPage() {
  const courses = await fetchPublishedCourses();

  return (
    <MarketingShell>
      <section className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16">
        <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Our Courses</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Personalized one-to-one coaching programs designed to build fluency, confidence, and
            career-ready communication skills.
          </p>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto grid max-w-[var(--container-width)] gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="block rounded-2xl border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-accent)]"
            >
              <h2 className="text-lg font-bold text-[var(--color-primary)]">{course.name}</h2>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{course.shortDescription}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)]">
                Know More →
              </span>
            </Link>
          ))}
          {courses.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">No published courses yet.</p>
          ) : null}
        </div>
      </section>
    </MarketingShell>
  );
}
