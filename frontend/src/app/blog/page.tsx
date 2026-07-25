import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { BlogPageView } from '@/components/blog/BlogPageView';
import {
  fetchBlogCategories,
  fetchBlogPosts,
  fetchPublishedPage,
} from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPublishedPage('blog');
  if (!page) return { title: 'Blog' };
  const title = page.metaTitle || page.title;
  const description = page.metaDescription || undefined;
  return {
    title,
    description,
    alternates: { canonical: page.canonicalUrl || `${siteUrl}/blog` },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      url: `${siteUrl}/blog`,
    },
    robots: {
      index: page.robotsIndex,
      follow: page.robotsFollow,
    },
  };
}

export default async function BlogPage() {
  const [page, posts, categories] = await Promise.all([
    fetchPublishedPage('blog'),
    fetchBlogPosts(),
    fetchBlogCategories(),
  ]);
  if (!page) notFound();

  return (
    <MarketingShell>
      <BlogPageView page={page} posts={posts} categories={categories} />
    </MarketingShell>
  );
}
