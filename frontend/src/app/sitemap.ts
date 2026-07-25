import type { MetadataRoute } from 'next';
import {
  fetchBlogPosts,
  fetchPublishedCourses,
  fetchPublishedPage,
} from '@/lib/public-cms';

const MARKETING_SLUGS = [
  'reviews',
  'blog',
  'contact',
  'faq',
  'privacy',
  'terms',
  'refund-policy',
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  const [about, courses, blogPosts, ...marketingPages] = await Promise.all([
    fetchPublishedPage('about'),
    fetchPublishedCourses(),
    fetchBlogPosts(),
    ...MARKETING_SLUGS.map((slug) => fetchPublishedPage(slug)),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  if (about) {
    entries.push({
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  MARKETING_SLUGS.forEach((slug, index) => {
    const page = marketingPages[index];
    if (!page) return;
    entries.push({
      url: `${siteUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: slug === 'blog' ? 'weekly' : 'monthly',
      priority: slug === 'contact' || slug === 'reviews' ? 0.85 : 0.7,
    });
  });

  for (const course of courses) {
    entries.push({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  for (const post of blogPosts) {
    entries.push({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  }

  return entries;
}
