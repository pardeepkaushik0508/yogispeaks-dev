'use client';

import Link from 'next/link';
import { Calendar, ChevronRight, User } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { RichHtml } from '@/components/marketing/RichHtml';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref } from '@/data/homepage';
import type { CmsBlogPost } from '@/lib/cms-types';

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogPostView({
  post,
  relatedPosts,
}: {
  post: CmsBlogPost;
  relatedPosts: CmsBlogPost[];
}) {
  return (
    <>
      <section className="bg-[var(--color-surface)] py-8 sm:py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-[var(--color-muted)]">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-[var(--color-accent)]">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden />
              <li>
                <Link href="/blog" className="hover:text-[var(--color-accent)]">
                  Blog
                </Link>
              </li>
              {post.category ? (
                <>
                  <ChevronRight className="size-3.5" aria-hidden />
                  <li>
                    <Link
                      href={`/blog#categories`}
                      className="hover:text-[var(--color-accent)]"
                    >
                      {post.category.name}
                    </Link>
                  </li>
                </>
              ) : null}
              <ChevronRight className="size-3.5" aria-hidden />
              <li className="font-medium text-[var(--color-primary)]">{post.title}</li>
            </ol>
          </nav>

          <MotionReveal variants={fadeUp}>
            {post.category ? (
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                {post.category.name}
              </p>
            ) : null}
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <User className="size-4" aria-hidden />
                {post.authorName}
              </span>
              {post.publishedAt ? (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4" aria-hidden />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              ) : null}
            </div>
          </MotionReveal>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {post.excerpt ? (
            <p className="mb-8 text-lg leading-relaxed text-[var(--color-muted)]">
              {post.excerpt}
            </p>
          ) : null}
          <RichHtml html={post.bodyHtml} className="text-[var(--color-text)]" />
        </div>
      </section>

      {relatedPosts.length ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-8 text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-5"
                >
                  <h3 className="font-bold text-[var(--color-primary)]">
                    <Link href={`/blog/${related.slug}`} className="hover:text-[var(--color-accent)]">
                      {related.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--color-muted)]">
                    {related.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Ready to Apply What You&apos;ve Learned?
          </h2>
          <p className="mt-3 text-sm text-white/80">
            Book a free communication assessment and get personalized coaching guidance.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href={bookAssessmentHref} variant="primary" arrow openAssessment>
              Book Free Communication Assessment
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
