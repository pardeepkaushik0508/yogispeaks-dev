import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { LegalPageView } from '@/components/legal/LegalPageView';
import { fetchPublishedPage } from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage('privacy');
  if (!page) return { title: 'Privacy Policy' };
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl || `${siteUrl}/privacy` },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: `${siteUrl}/privacy`,
    },
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
  };
}

export default async function PrivacyPage() {
  const page = await fetchPublishedPage('privacy');
  if (!page) notFound();
  return (
    <MarketingShell>
      <LegalPageView page={page} />
    </MarketingShell>
  );
}
