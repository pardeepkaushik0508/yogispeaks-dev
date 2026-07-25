'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  Briefcase,
  Languages,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { programs } from '@/data/homepage';
import {
  fadeUp,
  MotionItem,
  MotionReveal,
  staggerContainer,
} from '@/components/home/motion';

const programIcons = {
  'spoken-english': MessageCircle,
  'ielts-preparation': BookOpen,
  'professional-communication': Briefcase,
  'personality-development': Sparkles,
  'spoken-hindi': Languages,
} as const;

export function ProgramsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="programs"
      aria-labelledby="programs-heading"
      className="overflow-x-hidden bg-[var(--color-surface)] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
        <MotionReveal className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Our Programs
          </p>
          <h2
            id="programs-heading"
            className="mx-auto max-w-2xl text-2xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-3xl lg:text-4xl"
          >
            Programs Designed for Real Growth
          </h2>
        </MotionReveal>

        <motion.ul
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6"
          variants={staggerContainer}
          initial={reduceMotion ? false : 'hidden'}
          whileInView={reduceMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.12, margin: '-40px' }}
        >
          {programs.map((program) => {
            const Icon =
              programIcons[program.slug as keyof typeof programIcons] ?? MessageCircle;
            return (
              <MotionItem
                key={program.slug}
                as="li"
                variants={fadeUp}
                className="group flex flex-col"
              >
                <div className="relative mb-6 aspect-[4/3] overflow-visible">
                  <div className="relative h-full overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-secondary)]">
                    <Image
                      src={program.image}
                      alt={`${program.title} course at YogiSpeaks`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[15px] left-[20px] z-10 inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-accent)] shadow-md"
                  >
                    <Icon className="size-5" />
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-[var(--color-text)]">
                  {program.title}
                </h3>
                <p className="mb-3 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
                  {program.description}
                </p>
                <Link
                  href={
                    program.slug === 'spoken-english' || program.slug === 'ielts-preparation'
                      ? `/courses/${program.slug}`
                      : `/courses`
                  }
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  Know More{' '}
                  <span aria-hidden="true" className="hidden sm:inline">
                    →
                  </span>
                </Link>
              </MotionItem>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
