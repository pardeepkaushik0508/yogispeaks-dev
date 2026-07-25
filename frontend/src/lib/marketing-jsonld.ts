import type { CmsFaq, CmsPage, CmsTestimonial } from '@/lib/cms-types';
import { asBlockMeta, asItemList, getPageBlock, htmlToPlainText } from '@/lib/public-cms';

export function reviewsJsonLd(
  page: CmsPage,
  testimonials: CmsTestimonial[],
  siteUrl: string,
) {
  const hero = getPageBlock(page, 'hero');
  const heroMeta = asBlockMeta(hero?.itemsJson);
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'YogiSpeaks',
    url: siteUrl,
    aggregateRating: heroMeta.ratingValue
      ? {
          '@type': 'AggregateRating',
          ratingValue: heroMeta.ratingValue,
          reviewCount: heroMeta.ratingCount?.replace(/\D/g, '') || testimonials.length,
          bestRating: '5',
        }
      : undefined,
    review: testimonials.slice(0, 20).map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.studentName },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: t.rating || 5,
        bestRating: '5',
      },
      reviewBody: t.review,
    })),
  };
}

export function faqPageJsonLd(faqs: CmsFaq[]) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: htmlToPlainText(faq.answerHtml),
      },
    })),
  };
}

export function reviewsBlockFaqJsonLd(page: CmsPage) {
  const faqs = getPageBlock(page, 'faqs');
  const items = asItemList(faqs?.itemsJson);
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.description || '',
      },
    })),
  };
}
