import type { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { CoursesIndexView } from '@/components/courses/CoursesIndexView';
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
      <CoursesIndexView courses={courses} />
    </MarketingShell>
  );
}
