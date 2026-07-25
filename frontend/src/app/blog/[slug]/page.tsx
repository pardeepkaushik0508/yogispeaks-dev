import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { BlogPostView } from '@/components/blog/BlogPostView';
import { fetchBlogPost, fetchBlogPosts } from '@/lib/public-cms';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return { title: 'Article' };
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      type: 'article',
      publishedTime: post.publishedAt || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([fetchBlogPost(slug), fetchBlogPosts()]);
  if (!post) notFound();

  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.id !== post.id &&
        post.category?.id &&
        p.category?.id === post.category.id,
    )
    .slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: post.authorName },
    datePublished: post.publishedAt,
    publisher: { '@type': 'Organization', name: 'YogiSpeaks', url: siteUrl },
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogPostView post={post} relatedPosts={relatedPosts} />
    </MarketingShell>
  );
}
