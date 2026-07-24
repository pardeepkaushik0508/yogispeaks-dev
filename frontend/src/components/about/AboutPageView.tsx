'use client';

import { Check, Sparkles } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { RichHtml } from '@/components/marketing/RichHtml';
import { MotionReveal, fadeUp } from '@/components/home/motion';
import { bookAssessmentHref } from '@/data/homepage';
import type { CmsPage } from '@/lib/cms-types';
import { asCtaMeta, asItemList, getPageBlock } from '@/lib/public-cms';

function SectionHeading({
  title,
  subtitle,
  id,
}: {
  title: string;
  subtitle?: string | null;
  id?: string;
}) {
  return (
    <div className="mb-8 max-w-3xl text-center sm:mb-10 sm:mx-auto sm:text-left">
      <h2
        id={id}
        className="text-2xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-3xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function MidCta() {
  return (
    <div className="flex justify-center py-2">
      <ButtonLink href={bookAssessmentHref} variant="primary" arrow>
        Book Free Communication Assessment
      </ButtonLink>
    </div>
  );
}

export function AboutPageView({ page }: { page: CmsPage }) {
  const hero = getPageBlock(page, 'hero');
  const story = getPageBlock(page, 'story');
  const mission = getPageBlock(page, 'mission');
  const vision = getPageBlock(page, 'vision');
  const values = getPageBlock(page, 'values');
  const whyChoose = getPageBlock(page, 'why_choose');
  const methodology = getPageBlock(page, 'methodology');
  const whoCanJoin = getPageBlock(page, 'who_can_join');
  const differentiators = getPageBlock(page, 'differentiators');
  const commitment = getPageBlock(page, 'commitment');
  const cta = getPageBlock(page, 'cta');
  const ctaMeta = asCtaMeta(cta?.itemsJson);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-on-dark)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 20% 20%, rgba(196,155,72,0.25), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(17,34,64,0.8), transparent 55%)',
          }}
        />
        <div className="relative mx-auto max-w-[var(--container-width)] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
          <MotionReveal variants={fadeUp} className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {hero?.title || page.title}
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {hero?.subtitle || 'About YogiSpeaks'}
            </h1>
            {hero?.bodyHtml ? (
              <div className="mt-6 [&_.rich-html]:text-white/85 [&_.rich-html_strong]:text-white">
                <RichHtml html={hero.bodyHtml} />
              </div>
            ) : null}
            <div className="mt-8">
              <ButtonLink href={bookAssessmentHref} variant="primary" arrow>
                Book Free Communication Assessment
              </ButtonLink>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Story */}
      {story ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <SectionHeading title={story.title || 'Our Story'} />
            {story.bodyHtml ? <RichHtml html={story.bodyHtml} className="max-w-3xl text-[var(--color-text)]" /> : null}
            <div className="mt-10">
              <MidCta />
            </div>
          </div>
        </section>
      ) : null}

      {/* Mission + Vision */}
      {(mission || vision) && (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16">
          <div className="mx-auto grid max-w-[var(--container-width)] gap-6 px-4 sm:px-6 lg:grid-cols-2">
            {mission ? (
              <MotionReveal
                variants={fadeUp}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8"
              >
                <h2 className="text-xl font-extrabold text-[var(--color-primary)]">
                  {mission.title || 'Our Mission'}
                </h2>
                {mission.bodyHtml ? (
                  <RichHtml html={mission.bodyHtml} className="mt-4" />
                ) : null}
              </MotionReveal>
            ) : null}
            {vision ? (
              <MotionReveal
                variants={fadeUp}
                className="rounded-2xl border border-[var(--color-border)] bg-white p-6 sm:p-8"
              >
                <h2 className="text-xl font-extrabold text-[var(--color-primary)]">
                  {vision.title || 'Our Vision'}
                </h2>
                {vision.bodyHtml ? (
                  <RichHtml html={vision.bodyHtml} className="mt-4" />
                ) : null}
              </MotionReveal>
            ) : null}
          </div>
        </section>
      )}

      {/* Values */}
      {values ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <SectionHeading title={values.title || 'Our Core Values'} />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {asItemList(values.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-accent)]">
                    <Sparkles className="size-5" aria-hidden />
                  </div>
                  <h3 className="font-bold text-[var(--color-primary)]">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <MidCta />
            </div>
          </div>
        </section>
      ) : null}

      {/* Why choose */}
      {whyChoose ? (
        <section className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-extrabold tracking-tight sm:mb-10 sm:text-3xl">
              {whyChoose.title || 'Why Thousands Choose YogiSpeaks'}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {asItemList(whyChoose.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <h3 className="font-bold text-[var(--color-accent)]">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-white/80">
                      {item.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Methodology */}
      {methodology ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <SectionHeading
              title={methodology.title || 'Our Teaching Methodology'}
              subtitle={methodology.subtitle}
            />
            <ol className="relative mx-auto max-w-2xl space-y-0">
              {asItemList(methodology.itemsJson).map((item, i) => (
                <li key={item.title} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < asItemList(methodology.itemsJson).length - 1 ? (
                    <span
                      aria-hidden
                      className="absolute left-5 top-12 h-[calc(100%-2.5rem)] w-px bg-[var(--color-border)]"
                    />
                  ) : null}
                  <span className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-bold text-[var(--color-primary)]">{item.title}</h3>
                    {item.description ? (
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <MidCta />
            </div>
          </div>
        </section>
      ) : null}

      {/* Who can join */}
      {whoCanJoin ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <SectionHeading
              title={whoCanJoin.title || 'Who Can Join?'}
              subtitle={whoCanJoin.subtitle}
            />
            <ul className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {asItemList(whoCanJoin.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-primary)]"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Differentiators */}
      {differentiators ? (
        <section className="bg-white py-14 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
            <SectionHeading title={differentiators.title || 'What Makes Us Different?'} />
            <ul className="grid gap-3 sm:grid-cols-2">
              {asItemList(differentiators.itemsJson).map((item) => (
                <li key={item.title} className="flex items-start gap-3 text-sm sm:text-base">
                  <Check
                    className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]"
                    aria-hidden
                  />
                  <span className="font-medium text-[var(--color-text)]">{item.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Commitment */}
      {commitment ? (
        <section className="bg-[var(--color-surface)] py-14 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">
              {commitment.title || 'Our Commitment'}
            </h2>
            {commitment.bodyHtml ? (
              <RichHtml html={commitment.bodyHtml} className="mt-6 text-left sm:text-center" />
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Final CTA */}
      {cta ? (
        <section className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {cta.title}
            </p>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              {cta.subtitle || 'Start Your Communication Journey Today'}
            </h2>
            {cta.bodyHtml ? (
              <div className="mt-4 [&_.rich-html]:text-white/85">
                <RichHtml html={cta.bodyHtml} />
              </div>
            ) : null}
            <div className="mt-8 flex justify-center">
              <ButtonLink
                href={ctaMeta.buttonHref || bookAssessmentHref}
                variant="primary"
                arrow
                openAssessment
              >
                {ctaMeta.buttonLabel || 'Book Free Communication Assessment'}
              </ButtonLink>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
