'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Search, User } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';
import { RichHtml } from '@/components/marketing/RichHtml';
import {
  AmbientMesh,
  CinematicHero,
  Container,
  DisplayHeading,
  Eyebrow,
  GoldRule,
} from '@/components/marketing/layout';
import { bookAssessmentHref } from '@/data/homepage';
import type { CmsBlogCategory, CmsBlogPost, CmsPage } from '@/lib/cms-types';
import { asBlockMeta, asCtaMeta, asItemList, getPageBlock } from '@/lib/public-cms';
import { cn } from '@/lib/cn';

function formatDate(value: string | null | undefined) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function BlogPageView({
  page,
  posts,
  categories,
}: {
  page: CmsPage;
  posts: CmsBlogPost[];
  categories: CmsBlogCategory[];
}) {
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState('all');

  const hero = getPageBlock(page, 'hero');
  const heroMeta = asBlockMeta(hero?.itemsJson);
  const whyRead = getPageBlock(page, 'why_read');
  const subscribe = getPageBlock(page, 'subscribe');
  const faqs = getPageBlock(page, 'faqs');
  const cta = getPageBlock(page, 'cta');
  const ctaMeta = asCtaMeta(cta?.itemsJson);
  const conversion = getPageBlock(page, 'conversion');
  const conversionMeta = asCtaMeta(conversion?.itemsJson);

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesCategory =
        categorySlug === 'all' || post.category?.slug === categorySlug;
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category?.name.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [posts, search, categorySlug]);

  const featured = filteredPosts[0];
  const rest = filteredPosts.slice(1);

  const faqItems = asItemList(faqs?.itemsJson).map((item) => ({
    question: item.title,
    answer: item.description || '',
  }));

  return (
    <>
      <CinematicHero
        media="none"
        eyebrow={hero?.title || 'Journal'}
        title={hero?.subtitle || 'Ideas for clearer, braver communication'}
        description={
          hero?.bodyHtml ? (
            <div className="[&_.rich-html]:text-white/75">
              <RichHtml html={hero.bodyHtml} />
            </div>
          ) : (
            'Practical notes on fluency, interviews, presence, and career conversations.'
          )
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={heroMeta.primaryHref || '#articles'} variant="primary">
            {heroMeta.primaryLabel || 'Explore Articles'}
          </ButtonLink>
          {heroMeta.secondaryLabel ? (
            <ButtonLink href={heroMeta.secondaryHref || '#categories'} variant="ghost-light">
              {heroMeta.secondaryLabel}
            </ButtonLink>
          ) : null}
        </div>
      </CinematicHero>

      <section
        id="categories"
        className="scroll-mt-24 border-b border-[var(--color-border)] bg-white/90 backdrop-blur"
      >
        <Container className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:gap-6">
          <Eyebrow tone="dark" className="shrink-0 pt-2.5">
            Topics
          </Eyebrow>
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="Blog topics"
          >
            <button
              type="button"
              role="tab"
              aria-selected={categorySlug === 'all'}
              onClick={() => setCategorySlug('all')}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                categorySlug === 'all'
                  ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-primary)] ring-1 ring-[var(--color-border)] hover:ring-[var(--color-accent)]',
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={categorySlug === cat.slug}
                onClick={() => {
                  setCategorySlug(cat.slug);
                  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                  categorySlug === cat.slug
                    ? 'bg-[var(--color-primary)] text-white shadow-[var(--shadow-card)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-primary)] ring-1 ring-[var(--color-border)] hover:ring-[var(--color-accent)]',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </Container>
      </section>

      <section id="articles" className="scroll-mt-24 bg-[var(--color-surface)] py-16 sm:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              Latest Articles
            </DisplayHeading>
            <div className="relative max-w-sm flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-muted)]"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-full border border-[var(--color-border)] bg-white py-3 pl-11 pr-4 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              />
            </div>
          </div>

          {featured ? (
            <article className="premium-shine mb-8 overflow-hidden rounded-[2rem] bg-[var(--color-primary-dark)] text-white shadow-[var(--shadow-elevated)]">
              <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
                <div className="p-8 sm:p-12">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    Featured{featured.category ? ` · ${featured.category.name}` : ''}
                  </p>
                  <h3 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                    <Link href={`/blog/${featured.slug}`} className="hover:text-[var(--color-accent)]">
                      {featured.title}
                    </Link>
                  </h3>
                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                    {featured.excerpt}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-white/55">
                    <span className="inline-flex items-center gap-1.5">
                      <User className="size-3.5" /> {featured.authorName}
                    </span>
                    {featured.publishedAt ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5" /> {formatDate(featured.publishedAt)}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-accent)]"
                  >
                    Read article <ArrowUpRight className="size-4" />
                  </Link>
                </div>
                <div
                  aria-hidden
                  className="relative min-h-[14rem] bg-[radial-gradient(circle_at_30%_30%,rgba(196,155,72,0.35),transparent_45%),linear-gradient(160deg,#112240,#050a18)] lg:min-h-full"
                >
                  <div className="absolute inset-8 rounded-[1.5rem] border border-white/10" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <p className="font-[family-name:var(--font-signature)] text-6xl text-[var(--color-accent)]">
                      YS
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <article
                key={post.id}
                className="premium-shine group flex flex-col rounded-[1.5rem] bg-white p-7 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1"
              >
                {post.category ? (
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                    {post.category.name}
                  </p>
                ) : null}
                <h3 className="font-display text-lg font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted)]">
                  <span>{post.authorName}</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </article>
            ))}
          </div>

          {!filteredPosts.length ? (
            <p className="py-16 text-center text-sm text-[var(--color-muted)]">
              No articles match your search.
            </p>
          ) : null}
        </Container>
      </section>

      {whyRead ? (
        <section className="bg-white py-16 sm:py-20">
          <Container>
            <GoldRule className="mb-5" />
            <DisplayHeading as="h2" className="mb-10 text-[var(--color-primary)]">
              {whyRead.title || 'Why Read the YogiSpeaks Blog?'}
            </DisplayHeading>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {asItemList(whyRead.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="border-l-[3px] border-[var(--color-accent)] bg-[var(--color-surface)] px-5 py-5 text-sm font-semibold text-[var(--color-text)]"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {subscribe ? (
        <section className="premium-grain relative overflow-hidden bg-[var(--color-primary-dark)] py-20 text-white sm:py-24">
          <AmbientMesh variant="gold" />
          <Container className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <DisplayHeading as="h2" className="text-white">
                {subscribe.title || 'Stay Updated'}
              </DisplayHeading>
              {subscribe.subtitle ? (
                <p className="mt-4 text-white/70">{subscribe.subtitle}</p>
              ) : null}
              <ul className="mt-6 space-y-2 text-sm text-white/65">
                {asItemList(subscribe.itemsJson).map((item) => (
                  <li key={item.title} className="flex gap-2">
                    <span className="text-[var(--color-accent)]">▸</span> {item.title}
                  </li>
                ))}
              </ul>
            </div>
            <NewsletterForm source="blog-page" />
          </Container>
        </section>
      ) : null}

      {faqItems.length ? (
        <section className="bg-[var(--color-surface)] py-16 sm:py-20">
          <Container className="max-w-3xl">
            <DisplayHeading as="h2" className="mb-10 text-[var(--color-primary)]">
              {faqs?.title || 'Frequently Asked Questions'}
            </DisplayHeading>
            <FaqAccordion items={faqItems} />
          </Container>
        </section>
      ) : null}

      {(cta || conversion) && (
        <section className="bg-white py-16 sm:py-20">
          <Container className="max-w-3xl text-center">
            <Eyebrow>{cta?.title || 'Keep learning'}</Eyebrow>
            <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
              {cta?.subtitle || conversion?.title}
            </DisplayHeading>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink
                href={ctaMeta.buttonHref || conversionMeta.buttonHref || '#articles'}
                variant="primary"
              >
                {ctaMeta.buttonLabel || conversionMeta.buttonLabel || 'Explore All Articles'}
              </ButtonLink>
              <ButtonLink href={bookAssessmentHref} variant="ghost-dark" openAssessment>
                {ctaMeta.secondaryLabel ||
                  conversionMeta.secondaryLabel ||
                  'Book Free Assessment'}
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
