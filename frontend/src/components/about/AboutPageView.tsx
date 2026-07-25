'use client';

import Image from 'next/image';
import { Check, Sparkles } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { RichHtml } from '@/components/marketing/RichHtml';
import {
  AssessmentCta,
  CinematicHero,
  Container,
  DisplayHeading,
  Eyebrow,
  GoldRule,
  MarqueeStrip,
  PremiumPanel,
} from '@/components/marketing/layout';
import { MotionReveal, fadeUp, MotionItem, staggerContainer } from '@/components/home/motion';
import { bookAssessmentHref } from '@/data/homepage';
import type { CmsPage } from '@/lib/cms-types';
import { asCtaMeta, asItemList, getPageBlock } from '@/lib/public-cms';
import { motion, useReducedMotion } from 'framer-motion';

export function AboutPageView({ page }: { page: CmsPage }) {
  const reduceMotion = useReducedMotion();
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
  const methodItems = asItemList(methodology?.itemsJson);
  const whyItems = asItemList(whyChoose?.itemsJson);

  return (
    <>
      <CinematicHero
        media="founder"
        eyebrow={hero?.title || page.title}
        title={
          hero?.subtitle || (
            <>
              Coaching that turns hesitation into{' '}
              <span className="text-[var(--color-accent)]">presence</span>
            </>
          )
        }
        description={
          hero?.bodyHtml ? (
            <div className="[&_.rich-html]:text-white/75 [&_.rich-html_strong]:text-white">
              <RichHtml html={hero.bodyHtml} />
            </div>
          ) : (
            'YogiSpeaks is built for learners who want real conversation skills — not classroom scripts.'
          )
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={bookAssessmentHref} variant="primary" arrow openAssessment>
            Book Free Communication Assessment
          </ButtonLink>
          <ButtonLink href="/courses" variant="ghost-light">
            Explore Programs
          </ButtonLink>
        </div>
      </CinematicHero>

      <MarqueeStrip
        items={[
          '1:1 Mentorship',
          'Career Communication',
          'Spoken Fluency',
          'Interview Presence',
          'IELTS Speaking',
          'Confidence Coaching',
        ]}
      />

      {story ? (
        <section className="relative overflow-hidden bg-white py-20 sm:py-28">
          <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <MotionReveal variants={fadeUp} className="relative">
              <div className="absolute -left-6 -top-6 size-28 rounded-full bg-[var(--color-accent)]/15 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-elevated)]">
                <Image
                  src="/brand/founder-portrait.png"
                  alt="Yogender, Coach & Founder of YogiSpeaks"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-[family-name:var(--font-signature)] text-5xl text-[var(--color-accent)]">
                    Yogender
                  </p>
                  <p className="text-sm font-semibold text-white">Coach & Founder · YogiSpeaks</p>
                </div>
              </div>
            </MotionReveal>
            <MotionReveal variants={fadeUp}>
              <GoldRule className="mb-5" />
              <Eyebrow>Our story</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                {story.title || 'Built around every learner’s voice'}
              </DisplayHeading>
              {story.bodyHtml ? (
                <RichHtml
                  html={story.bodyHtml}
                  className="mt-6 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
                />
              ) : null}
              <div className="mt-10">
                <AssessmentCta className="justify-start" />
              </div>
            </MotionReveal>
          </Container>
        </section>
      ) : null}

      {(mission || vision) && (
        <section className="bg-[var(--color-primary)] py-20 text-white sm:py-28">
          <Container className="grid gap-6 lg:grid-cols-2">
            {mission ? (
              <PremiumPanel>
                <Eyebrow>Mission</Eyebrow>
                <DisplayHeading as="h2" className="mt-3 text-white">
                  {mission.title || 'Our Mission'}
                </DisplayHeading>
                {mission.bodyHtml ? (
                  <div className="mt-5 [&_.rich-html]:text-white/75">
                    <RichHtml html={mission.bodyHtml} />
                  </div>
                ) : null}
              </PremiumPanel>
            ) : null}
            {vision ? (
              <PremiumPanel className="border-[var(--color-accent)]/25 bg-gradient-to-br from-[var(--color-accent)]/15 to-transparent">
                <Eyebrow>Vision</Eyebrow>
                <DisplayHeading as="h2" className="mt-3 text-white">
                  {vision.title || 'Our Vision'}
                </DisplayHeading>
                {vision.bodyHtml ? (
                  <div className="mt-5 [&_.rich-html]:text-white/75">
                    <RichHtml html={vision.bodyHtml} />
                  </div>
                ) : null}
              </PremiumPanel>
            ) : null}
          </Container>
        </section>
      )}

      {values ? (
        <section className="bg-[var(--color-surface)] py-20 sm:py-28">
          <Container>
            <div className="mb-14 max-w-2xl">
              <GoldRule className="mb-5" />
              <Eyebrow tone="dark">Principles</Eyebrow>
              <DisplayHeading as="h2" className="mt-3 text-[var(--color-primary)]">
                {values.title || 'Our Core Values'}
              </DisplayHeading>
            </div>
            <motion.ul
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial={reduceMotion ? false : 'hidden'}
              whileInView={reduceMotion ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.15 }}
            >
              {asItemList(values.itemsJson).map((item, i) => (
                <MotionItem
                  key={item.title}
                  as="li"
                  variants={fadeUp}
                  className="premium-shine group relative overflow-hidden rounded-[1.75rem] bg-white p-7 shadow-[var(--shadow-card)]"
                >
                  <span className="absolute right-5 top-3 font-display text-6xl font-extrabold text-[var(--color-primary)]/[0.04] transition-colors group-hover:text-[var(--color-accent)]/15">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-[var(--color-accent)]">
                    <Sparkles className="size-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--color-primary)]">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                      {item.description}
                    </p>
                  ) : null}
                </MotionItem>
              ))}
            </motion.ul>
          </Container>
        </section>
      ) : null}

      {whyChoose ? (
        <section className="premium-grain relative overflow-hidden bg-[var(--color-primary-dark)] py-20 text-white sm:py-28">
          <Container className="relative">
            <DisplayHeading as="h2" className="mx-auto mb-14 max-w-3xl text-center text-white">
              {whyChoose.title || 'Why Thousands Choose YogiSpeaks'}
            </DisplayHeading>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {whyItems.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-[var(--color-accent)]/40 hover:bg-white/[0.06]"
                >
                  <p className="mb-3 text-xs font-bold tracking-[0.2em] text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {methodology ? (
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <div className="mb-14 max-w-2xl">
              <GoldRule className="mb-5" />
              <DisplayHeading as="h2" className="text-[var(--color-primary)]">
                {methodology.title || 'Our Teaching Methodology'}
              </DisplayHeading>
              {methodology.subtitle ? (
                <p className="mt-4 text-[var(--color-muted)]">{methodology.subtitle}</p>
              ) : null}
            </div>
            <ol className="relative grid gap-4 lg:grid-cols-5">
              {methodItems.map((item, i) => (
                <li
                  key={item.title}
                  className="relative rounded-[1.5rem] bg-[var(--color-surface)] p-5 pt-8"
                >
                  <span className="absolute -top-3 left-5 inline-flex size-9 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white shadow-[var(--shadow-glow-gold)]">
                    {i + 1}
                  </span>
                  <h3 className="font-display font-bold text-[var(--color-primary)]">{item.title}</h3>
                  {item.description ? (
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ol>
            <div className="mt-14">
              <AssessmentCta />
            </div>
          </Container>
        </section>
      ) : null}

      {whoCanJoin ? (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] py-16">
          <Container>
            <DisplayHeading as="h2" className="mb-8 text-[var(--color-primary)]">
              {whoCanJoin.title || 'Who Can Join?'}
            </DisplayHeading>
            <ul className="flex flex-wrap gap-3">
              {asItemList(whoCanJoin.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {differentiators ? (
        <section className="bg-white py-20 sm:py-24">
          <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <GoldRule className="mb-5" />
              <DisplayHeading as="h2" className="text-[var(--color-primary)]">
                {differentiators.title || 'What Makes Us Different?'}
              </DisplayHeading>
            </div>
            <ul className="space-y-0">
              {asItemList(differentiators.itemsJson).map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-4 border-b border-[var(--color-border)] py-5 last:border-0"
                >
                  <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                    <Check className="size-4" />
                  </span>
                  <span className="font-display text-lg font-semibold text-[var(--color-text)]">
                    {item.title}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {commitment ? (
        <section className="bg-[var(--color-surface)] py-20 sm:py-24">
          <Container className="max-w-3xl text-center">
            <p className="font-[family-name:var(--font-signature)] text-7xl leading-none text-[var(--color-accent)]">
              “
            </p>
            <DisplayHeading as="h2" className="text-[var(--color-primary)]">
              {commitment.title || 'Our Commitment'}
            </DisplayHeading>
            {commitment.bodyHtml ? (
              <RichHtml html={commitment.bodyHtml} className="mt-6 text-left sm:text-center" />
            ) : null}
          </Container>
        </section>
      ) : null}

      {cta ? (
        <section className="premium-grain relative overflow-hidden bg-[var(--color-primary-dark)] py-20 text-white sm:py-28">
          <Container className="relative max-w-3xl text-center">
            <Eyebrow>{cta.title}</Eyebrow>
            <DisplayHeading as="h2" className="mt-4 text-white">
              {cta.subtitle || 'Start Your Communication Journey Today'}
            </DisplayHeading>
            {cta.bodyHtml ? (
              <div className="mt-5 [&_.rich-html]:text-white/75">
                <RichHtml html={cta.bodyHtml} />
              </div>
            ) : null}
            <div className="mt-10 flex justify-center">
              <ButtonLink
                href={ctaMeta.buttonHref || bookAssessmentHref}
                variant="primary"
                arrow
                openAssessment
              >
                {ctaMeta.buttonLabel || 'Book Free Communication Assessment'}
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
