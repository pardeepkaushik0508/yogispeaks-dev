'use client';

import { RichHtml } from '@/components/marketing/RichHtml';
import {
  Container,
  DisplayHeading,
  Eyebrow,
  GoldRule,
} from '@/components/marketing/layout';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import type { CmsPage } from '@/lib/cms-types';
import { getPageBlock } from '@/lib/public-cms';

export function LegalPageView({ page }: { page: CmsPage }) {
  const hero = getPageBlock(page, 'hero');

  return (
    <>
      <section className="premium-grain relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-primary-dark)] text-white">
        <Container className="relative py-16 sm:py-24">
          <MotionReveal variants={fadeUp} className="max-w-3xl">
            <GoldRule className="mb-6" />
            <Eyebrow>Legal</Eyebrow>
            <DisplayHeading className="mt-4 text-white">
              {hero?.title || page.title}
            </DisplayHeading>
            {hero?.subtitle ? (
              <p className="mt-4 text-white/65">{hero.subtitle}</p>
            ) : null}
            {hero?.bodyHtml ? (
              <div className="mt-4 [&_.rich-html]:text-white/65">
                <RichHtml html={hero.bodyHtml} />
              </div>
            ) : null}
          </MotionReveal>
        </Container>
      </section>

      <section className="bg-[var(--color-surface)] py-16 sm:py-24">
        <Container>
          <article className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--color-border)] bg-white px-6 py-10 shadow-[var(--shadow-elevated)] sm:px-12 sm:py-14">
            <RichHtml
              html={page.bodyHtml}
              className="text-[var(--color-text)] [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[var(--color-primary)] [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_li]:my-1.5 [&_p]:my-3.5 [&_p]:leading-relaxed [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-5"
            />
          </article>
        </Container>
      </section>
    </>
  );
}
