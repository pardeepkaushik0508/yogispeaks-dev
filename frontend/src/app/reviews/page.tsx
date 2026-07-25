import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { ReviewsPageView } from '@/components/reviews/ReviewsPageView';
import { reviewsJsonLd } from '@/lib/marketing-jsonld';
import {
  fetchPublishedPage,
  fetchVisibleTestimonials,
} from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage('reviews');
  if (!page) return { title: 'Reviews' };
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl || `${siteUrl}/reviews` },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: `${siteUrl}/reviews`,
    },
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
  };
}

export default async function ReviewsPage() {
  const [page, testimonials] = await Promise.all([
    fetchPublishedPage('reviews'),
    fetchVisibleTestimonials(),
  ]);
  if (!page) notFound();

  const jsonLd = reviewsJsonLd(page, testimonials, siteUrl);

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReviewsPageView page={page} testimonials={testimonials} />
    </MarketingShell>
  );
}
