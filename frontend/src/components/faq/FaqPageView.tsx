'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { RichHtml } from '@/components/marketing/RichHtml';
import {
  AmbientMesh,
  Container,
  DisplayHeading,
  Eyebrow,
  GoldRule,
} from '@/components/marketing/layout';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref } from '@/data/homepage';
import type { CmsFaq, CmsPage } from '@/lib/cms-types';
import { asBlockMeta, asCtaMeta, getPageBlock, htmlToPlainText } from '@/lib/public-cms';
import { cn } from '@/lib/cn';

const FAQ_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'courses', label: 'Courses' },
  { key: 'learning', label: 'Learning Experience' },
  { key: 'scheduling', label: 'Scheduling' },
  { key: 'technical', label: 'Technical' },
  { key: 'support', label: 'Support' },
] as const;

export function FaqPageView({ page, faqs }: { page: CmsPage; faqs: CmsFaq[] }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const hero = getPageBlock(page, 'hero');
  const heroMeta = asBlockMeta(hero?.itemsJson);
  const stillQuestions = getPageBlock(page, 'still_questions');
  const stillMeta = asCtaMeta(stillQuestions?.itemsJson);
  const cta = getPageBlock(page, 'cta');
  const ctaMeta = asCtaMeta(cta?.itemsJson);

  const filteredFaqs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesCategory = category === 'all' || faq.category === category;
      const plainAnswer = htmlToPlainText(faq.answerHtml);
      const matchesSearch =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        plainAnswer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, search, category]);

  const accordionItems = filteredFaqs.map((faq) => ({
    question: faq.question,
    answer: htmlToPlainText(faq.answerHtml),
  }));

  return (
    <>
      <section className="premium-grain relative overflow-hidden bg-[var(--color-primary-dark)] text-white">
        <AmbientMesh variant="gold" />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <MotionReveal variants={fadeUp} className="mx-auto max-w-3xl text-center">
            <GoldRule className="mx-auto mb-6" />
            <Eyebrow>{hero?.title || page.title}</Eyebrow>
            <DisplayHeading className="mt-4 text-white">
              {hero?.subtitle || 'Answers, without the runaround'}
            </DisplayHeading>
            {hero?.bodyHtml ? (
              <div className="mt-5 [&_.rich-html]:text-white/70">
                <RichHtml html={hero.bodyHtml} />
              </div>
            ) : (
              <p className="mt-5 text-white/70">
                Search courses, scheduling, and coaching logistics in one place.
              </p>
            )}
            <div className="relative mx-auto mt-10 max-w-xl">
              <Search
                className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[var(--color-muted)]"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a question…"
                className="w-full rounded-full border border-white/10 bg-white py-4 pl-14 pr-5 text-base text-[var(--color-primary)] shadow-[var(--shadow-elevated)] placeholder:text-[var(--color-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              />
            </div>
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[var(--color-surface)] py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                Browse
              </p>
              <div
                className="flex flex-wrap gap-2 lg:flex-col lg:gap-1"
                role="tablist"
                aria-label="FAQ categories"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    role="tab"
                    aria-selected={category === cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={cn(
                      'rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all lg:w-full',
                      category === cat.key
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--color-primary)] hover:bg-[var(--color-surface)]',
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-xs text-[var(--color-muted)]">
                {filteredFaqs.length} result{filteredFaqs.length === 1 ? '' : 's'}
              </p>
            </div>
          </aside>

          <div>
            {accordionItems.length ? (
              <FaqAccordion items={accordionItems} />
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-[var(--color-border)] bg-white py-20 text-center text-sm text-[var(--color-muted)]">
                No FAQs match your search. Try another keyword or category.
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="premium-grain relative overflow-hidden bg-[var(--color-primary)] py-20 text-white sm:py-24">
        <AmbientMesh />
        <Container className="relative max-w-3xl text-center">
          <DisplayHeading as="h2" className="text-white">
            {stillQuestions?.title || cta?.subtitle || 'Still have questions?'}
          </DisplayHeading>
          {stillQuestions?.subtitle ? (
            <p className="mt-4 text-white/70">{stillQuestions.subtitle}</p>
          ) : null}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href={bookAssessmentHref} variant="primary" arrow openAssessment>
              {stillMeta.buttonLabel ||
                ctaMeta.buttonLabel ||
                heroMeta.primaryLabel ||
                'Book Free Assessment'}
            </ButtonLink>
            <ButtonLink
              href={stillMeta.secondaryHref || ctaMeta.secondaryHref || '/contact'}
              variant="ghost-light"
            >
              {stillMeta.secondaryLabel ||
                ctaMeta.secondaryLabel ||
                heroMeta.secondaryLabel ||
                'Contact Our Team'}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
