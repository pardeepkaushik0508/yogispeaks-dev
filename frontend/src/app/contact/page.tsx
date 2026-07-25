import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { ContactPageView } from '@/components/contact/ContactPageView';
import { fetchPublishedCourses, fetchPublishedPage } from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage('contact');
  if (!page) return { title: 'Contact' };
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl || `${siteUrl}/contact` },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: `${siteUrl}/contact`,
    },
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
  };
}

export default async function ContactPage() {
  const [page, courses] = await Promise.all([
    fetchPublishedPage('contact'),
    fetchPublishedCourses(),
  ]);
  if (!page) notFound();

  return (
    <MarketingShell>
      <ContactPageView page={page} courses={courses} />
    </MarketingShell>
  );
}
