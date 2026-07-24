import type { MetadataRoute } from 'next';
import { fetchPublishedCourses, fetchPublishedPage } from '@/lib/public-cms';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

  const [about, courses] = await Promise.all([
    fetchPublishedPage('about'),
    fetchPublishedCourses(),
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

  for (const course of courses) {
    entries.push({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  return entries;
}
