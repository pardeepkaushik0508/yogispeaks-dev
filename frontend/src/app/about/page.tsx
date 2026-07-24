import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { AboutPageView } from '@/components/about/AboutPageView';
import { fetchPublishedPage } from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage('about');
  if (!page) {
    return { title: 'About Us' };
  }
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl || `${siteUrl}/about` },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: `${siteUrl}/about`,
    },
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
  };
}

export default async function AboutPage() {
  const page = await fetchPublishedPage('about');
  if (!page) notFound();

  return (
    <MarketingShell>
      <AboutPageView page={page} />
    </MarketingShell>
  );
}
