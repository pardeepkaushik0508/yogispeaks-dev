'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  Layers,
  MessageSquareText,
  RefreshCw,
  UserRound,
} from 'lucide-react';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { faqs, featuresSection } from '@/data/homepage';
import {
  fadeRight,
  fadeUp,
  MotionItem,
  MotionReveal,
  staggerContainer,
} from '@/components/home/motion';

const iconMap = {
  user: UserRound,
  message: MessageSquareText,
  calendar: CalendarDays,
  layers: Layers,
  refresh: RefreshCw,
  heart: HeartHandshake,
};

const FAQ_PREVIEW_COUNT = 5;

export function FeaturesFaqSection() {
  const reduceMotion = useReducedMotion();
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, FAQ_PREVIEW_COUNT);

  return (
    <section
      aria-labelledby="features-heading"
      className="bg-white py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
        {/* Features column (heading + 6 boxes) | FAQ column */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-5">
          <div className="min-w-0 flex-1">
            <MotionReveal className="mb-8 text-center sm:mb-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)] sm:text-sm">
                {featuresSection.eyebrow}
              </p>
              <h2
                id="features-heading"
                className="text-xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-3xl lg:whitespace-nowrap lg:text-[2rem] xl:text-4xl"
              >
                {featuresSection.title}
              </h2>
            </MotionReveal>

            <motion.ul
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2.5 xl:gap-3"
              variants={staggerContainer}
              initial={reduceMotion ? false : 'hidden'}
              whileInView={reduceMotion ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.1, margin: '-40px' }}
            >
              {featuresSection.items.map((item) => {
                const Icon = iconMap[item.icon];
                return (
                  <MotionItem
                    key={item.title}
                    as="li"
                    variants={fadeUp}
                    className="flex min-w-0 flex-col items-center rounded-2xl border border-[#e8e8e8] bg-white px-2.5 py-5 text-center sm:px-3 sm:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-accent)] sm:mb-4 sm:size-14"
                    >
                      <Icon className="size-6 sm:size-7" strokeWidth={1.75} />
                    </span>
                    <h3 className="mb-2 text-xs font-bold leading-snug text-[var(--color-primary)] sm:text-sm">
                      {item.title}
                    </h3>
                    <p className="text-[11px] leading-relaxed text-[var(--color-muted)] sm:text-xs">
                      {item.description}
                    </p>
                  </MotionItem>
                );
              })}
            </motion.ul>
          </div>

          <MotionReveal
            as="aside"
            id="faq"
            variants={fadeRight}
            delay={0.1}
            className="flex w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white p-4 sm:p-5 lg:w-[28rem] lg:min-w-[28rem] lg:max-w-[28rem]"
          >
            <div className="mb-3 flex flex-nowrap items-center justify-between gap-x-2">
              <h2
                id="faq-heading"
                className="min-w-0 truncate text-[10px] font-extrabold uppercase tracking-[0.1em] text-[var(--color-accent)] sm:text-[11px] sm:tracking-[0.12em]"
              >
                Frequently Asked Questions
              </h2>
              <button
                type="button"
                onClick={() => setShowAllFaqs((v) => !v)}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
              >
                {showAllFaqs ? 'Show Less' : 'View All FAQ'}
                <ArrowRight
                  className={`size-3.5 transition-transform ${showAllFaqs ? 'rotate-90' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="min-h-0 min-w-0 w-full flex-1 overflow-hidden">
              <FaqAccordion items={visibleFaqs} />
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
