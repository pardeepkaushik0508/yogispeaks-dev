'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Globe2,
  Star,
  UserRound,
  Users,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { heroContent, stats } from '@/data/homepage';
import { AnimatedCounter } from '@/components/home/AnimatedCounter';

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

const statIcons = [UserRound, Users, Star, Globe2];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-on-dark)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/brand/hero-bg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />
        {/* Soft left fade only — no solid panel behind the person */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-dark)]/80 to-transparent lg:via-[var(--color-primary-dark)]/55 lg:to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-[var(--container-width)] items-end gap-8 px-4 pt-12 sm:gap-10 sm:px-6 sm:pt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:pt-20 xl:gap-10">
        <motion.div
          className="pb-12 sm:pb-16 lg:pb-20"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] sm:mb-4 sm:text-sm">
            {heroContent.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mb-4 max-w-xl text-[1.5rem] font-extrabold leading-[1.15] tracking-tight sm:mb-5 sm:text-3xl lg:text-[2.5rem] xl:text-[2.75rem]"
          >
            {highlightHeading(heroContent.heading, heroContent.highlightPhrases)}
          </h1>
          <p className="mb-7 max-w-lg text-[0.95rem] leading-relaxed text-[var(--color-on-dark-muted)] sm:mb-8 sm:text-lg">
            {heroContent.description}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink
              href={heroContent.primaryCta.href}
              arrow
              className="w-full rounded-md px-6 py-3.5 text-center text-sm sm:w-auto sm:text-base"
            >
              {heroContent.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={heroContent.secondaryCta.href}
              variant="ghost-light"
              className="w-full rounded-md border-white/80 px-6 py-3.5 text-center text-sm sm:w-auto sm:text-base"
            >
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>

          <motion.ul
            className="mt-9 grid grid-cols-2 gap-x-4 gap-y-6 border-t border-white/10 pt-7 sm:mt-10 sm:gap-5 sm:pt-8 lg:grid-cols-4"
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
            }}
          >
            {stats.map((stat, i) => {
              const Icon = statIcons[i] ?? Globe2;
              const isGlobe = i === 3;
              return (
                <motion.li
                  key={stat.label}
                  className="flex w-full min-w-0 flex-col items-center text-center"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <Icon
                    className={
                      isGlobe
                        ? 'mb-2.5 size-7 text-[var(--color-accent)] sm:mb-3 sm:size-8'
                        : 'mb-2.5 size-7 fill-[var(--color-accent)] text-[var(--color-accent)] sm:mb-3 sm:size-8'
                    }
                    strokeWidth={isGlobe ? 2 : 1.5}
                    aria-hidden="true"
                  />
                  {stat.value ? (
                    <AnimatedCounter
                      value={stat.value}
                      className="mb-1 block text-xl font-bold text-[var(--color-accent)] sm:text-2xl"
                    />
                  ) : null}
                  <span className="w-full text-[11px] font-bold leading-snug text-white sm:text-xs">
                    {stat.label}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>

        <motion.div
          className="relative flex w-full items-end justify-center gap-3 self-end sm:gap-5 lg:justify-end lg:gap-6"
          initial={reduceMotion ? false : { opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.12 }}
        >
          {/* Flush to section bottom — no bottom gap */}
          <div className="relative w-[70%] max-w-[380px] shrink-0 leading-none sm:max-w-[440px] lg:max-w-[480px] xl:max-w-[520px]">
            <Image
              src="/brand/founder-cutout.png"
              alt="Yogender, Coach and Founder of YogiSpeaks"
              width={640}
              height={927}
              priority
              sizes="(max-width: 1024px) 70vw, 520px"
              className="block h-auto w-full max-w-full translate-y-[1px] select-none"
            />
          </div>

          {/* Quote beside the person */}
          <blockquote className="mb-[18%] max-w-[11.5rem] shrink-0 self-center sm:max-w-[13.5rem] lg:mb-[12%] lg:max-w-[15rem]">
            <span
              aria-hidden="true"
              className="block font-[family-name:var(--font-signature)] text-6xl font-normal leading-[0.55] text-[var(--color-accent)] sm:text-7xl"
            >
              “
            </span>
            <p className="mt-2 mb-4 text-sm font-medium leading-relaxed text-white sm:mt-2.5 sm:text-[0.95rem]">
              {heroContent.founderQuote}
            </p>
            <footer>
              <cite className="not-italic">
                <span className="mb-3 block font-[family-name:var(--font-signature)] text-[2.35rem] font-normal leading-none tracking-wide text-[var(--color-accent)] sm:mb-3.5 sm:text-[2.75rem]">
                  {heroContent.founderName}
                </span>
                <span className="block text-xs font-bold leading-snug text-white/90 sm:text-sm">
                  {heroContent.founderRole}
                </span>
                <span className="mt-1 block text-sm font-bold text-white">
                  Yogi
                  <span className="text-[var(--color-accent)]">Speaks</span>
                </span>
              </cite>
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
