import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { FaqPageView } from '@/components/faq/FaqPageView';
import { faqPageJsonLd } from '@/lib/marketing-jsonld';
import { fetchPublishedPage, fetchVisibleFaqs } from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage('faq');
  if (!page) return { title: 'FAQ' };
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl || `${siteUrl}/faq` },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: `${siteUrl}/faq`,
    },
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
  };
}

export default async function FaqPage() {
  const [page, faqs] = await Promise.all([
    fetchPublishedPage('faq'),
    fetchVisibleFaqs(),
  ]);
  if (!page) notFound();

  const jsonLd = faqPageJsonLd(faqs);

  return (
    <MarketingShell>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <FaqPageView page={page} faqs={faqs} />
    </MarketingShell>
  );
}
