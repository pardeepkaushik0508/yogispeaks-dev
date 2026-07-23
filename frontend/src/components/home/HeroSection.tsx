'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Star,
  Users,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { heroContent, stats } from '@/data/homepage';

function highlightHeading(text: string, phrases: string[]) {
  let result: React.ReactNode[] = [text];
  for (const phrase of phrases) {
    result = result.flatMap((chunk) => {
      if (typeof chunk !== 'string') return [chunk];
      const parts = chunk.split(phrase);
      if (parts.length === 1) return [chunk];
      const nodes: React.ReactNode[] = [];
      parts.forEach((part, i) => {
        nodes.push(part);
        if (i < parts.length - 1) {
          nodes.push(
            <span key={`${phrase}-${i}`} className="text-[var(--color-accent)]">
              {phrase}
            </span>,
          );
        }
      });
      return nodes;
    });
  }
  return result;
}

const statIcons = [Award, Users, Star, BadgeCheck];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-on-dark)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(196,155,72,0.12),transparent_50%),radial-gradient(ellipse_at_80%_60%,rgba(17,34,64,0.9),transparent_55%),linear-gradient(135deg,#050a18_0%,#0a192f_45%,#050a18_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="relative mx-auto grid max-w-[var(--container-width)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:py-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {heroContent.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mb-5 max-w-xl font-[family-name:var(--font-montserrat)] text-3xl font-extrabold leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.65rem]"
          >
            {highlightHeading(heroContent.heading, heroContent.highlightPhrases)}
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed text-[var(--color-on-dark-muted)] sm:text-lg">
            {heroContent.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={heroContent.primaryCta.href} arrow>
              {heroContent.primaryCta.label}
            </ButtonLink>
            <ButtonLink href={heroContent.secondaryCta.href} variant="ghost-light">
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>

          <ul className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = statIcons[i] ?? BadgeCheck;
              return (
                <li key={stat.label} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    {stat.value ? (
                      <span className="block font-[family-name:var(--font-montserrat)] text-xl font-bold text-white">
                        {stat.value}
                      </span>
                    ) : null}
                    <span className="block text-xs leading-snug text-[var(--color-on-dark-muted)]">
                      {stat.label}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-md lg:max-w-none"
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary-dark)] ring-1 ring-white/10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(196,155,72,0.18),transparent_55%)]"
            />
            <div className="absolute inset-x-0 bottom-0 flex h-[72%] items-end justify-center">
              <div className="flex h-full w-[78%] flex-col items-center justify-end rounded-t-[40%] bg-gradient-to-t from-[#1a2a44] via-[#243552] to-[#3a4d6a]">
                <div className="mb-[18%] flex size-28 items-center justify-center rounded-full bg-[var(--color-primary)]/40 ring-2 ring-[var(--color-accent)]/40">
                  <span className="font-[family-name:var(--font-montserrat)] text-3xl font-bold tracking-widest text-[var(--color-accent)]">
                    YS
                  </span>
                </div>
              </div>
            </div>
            <p className="sr-only">
              Founder portrait placeholder — replace with studio photo in media library
            </p>
          </div>

          <blockquote className="absolute bottom-6 left-0 right-4 max-w-xs rounded-[var(--radius-md)] border border-white/10 bg-[var(--color-primary)]/90 p-4 shadow-lg backdrop-blur-sm sm:-left-4">
            <span
              aria-hidden="true"
              className="mb-1 block font-[family-name:var(--font-montserrat)] text-3xl leading-none text-[var(--color-accent)]"
            >
              “
            </span>
            <p className="text-sm italic leading-relaxed text-white">
              {heroContent.founderQuote}
            </p>
            <footer className="mt-2 text-xs text-[var(--color-on-dark-muted)]">
              — {heroContent.founderAttribution}
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
