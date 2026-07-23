'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  HeartHandshake,
  Layers,
  MessageSquareText,
  RefreshCw,
  UserRound,
} from 'lucide-react';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { faqs, featuresSection } from '@/data/homepage';

const iconMap = {
  user: UserRound,
  message: MessageSquareText,
  calendar: CalendarDays,
  layers: Layers,
  refresh: RefreshCw,
  heart: HeartHandshake,
};

export function FeaturesFaqSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="features-heading"
      className="bg-white py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-[var(--container-width)] gap-12 px-4 sm:px-6 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            {featuresSection.eyebrow}
          </p>
          <h2
            id="features-heading"
            className="mb-8 max-w-md font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-4xl"
          >
            {featuresSection.title}
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuresSection.items.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <li key={item.title}>
                  <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-accent)]">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mb-2 font-[family-name:var(--font-montserrat)] text-base font-bold text-[var(--color-text)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </motion.div>

        <aside aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="mb-4 font-[family-name:var(--font-montserrat)] text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--color-primary)]"
          >
            Frequently Asked Questions
          </h2>
          <FaqAccordion items={faqs} />
        </aside>
      </div>
    </section>
  );
}
