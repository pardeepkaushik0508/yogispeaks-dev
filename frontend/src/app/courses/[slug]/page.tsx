import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { CoursePageView } from '@/components/courses/CoursePageView';
import {
  fetchPublishedCourse,
  fetchPublishedCourses,
  fetchVisibleTestimonials,
  htmlToPlainText,
} from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const courses = await fetchPublishedCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await fetchPublishedCourse(slug);
  if (!course) return { title: 'Course' };
  const title = course.metaTitle || course.name;
  const description = course.metaDescription || course.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/courses/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/courses/${slug}`,
    },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const [course, testimonials] = await Promise.all([
    fetchPublishedCourse(slug),
    fetchVisibleTestimonials(),
  ]);
  if (!course) notFound();

  const faqJsonLd =
    course.faqs?.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: course.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: htmlToPlainText(f.answerHtml),
            },
          })),
        }
      : null;

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.metaDescription || course.shortDescription,
    provider: {
      '@type': 'Organization',
      name: 'YogiSpeaks',
      url: siteUrl,
    },
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <CoursePageView course={course} testimonials={testimonials} />
    </MarketingShell>
  );
}
