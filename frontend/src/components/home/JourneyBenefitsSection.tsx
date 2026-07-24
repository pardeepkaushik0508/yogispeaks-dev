'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Check,
  ClipboardCheck,
  Mic2,
  Route,
  Trophy,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { benefits, journeySteps } from '@/data/homepage';
import {
  fadeRight,
  fadeUp,
  MotionItem,
  MotionReveal,
  staggerContainer,
} from '@/components/home/motion';

const stepIcons = {
  clipboard: ClipboardCheck,
  map: Route,
  mic: Mic2,
  chart: TrendingUp,
  trophy: Trophy,
};

export function JourneyBenefitsSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="journey-heading"
      className="overflow-x-hidden bg-white py-16 sm:py-20"
    >
      <div className="mx-auto grid max-w-[var(--container-width)] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.85fr)] lg:gap-12 xl:gap-16">
        <div>
          <MotionReveal className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)] sm:text-sm">
              Our Teaching Method
            </p>
            <h2
              id="journey-heading"
              className="text-2xl font-extrabold tracking-tight text-[var(--color-primary)] sm:text-3xl lg:text-4xl"
            >
              How Your Learning Journey Works
            </h2>
          </MotionReveal>

          <motion.ol
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-2"
            variants={staggerContainer}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={{ once: true, amount: 0.15, margin: '-40px' }}
          >
            {journeySteps.map((step, index) => {
              const Icon = stepIcons[step.icon];
              return (
                <MotionItem
                  key={step.title}
                  as="li"
                  variants={fadeUp}
                  className="relative text-center"
                >
                  {index < journeySteps.length - 1 ? (
                    <ArrowRight
                      aria-hidden="true"
                      className="absolute -right-1 top-[1.35rem] hidden size-5 text-[var(--color-accent)] lg:block xl:-right-2"
                    />
                  ) : null}
                  <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                    Step {index + 1}
                  </p>
                  <h3 className="mb-1 text-sm font-bold text-[var(--color-text)]">
                    {step.title}
                  </h3>
                  <p className="mx-auto max-w-[11rem] text-xs leading-relaxed text-[var(--color-muted)]">
                    {step.description}
                  </p>
                </MotionItem>
              );
            })}
          </motion.ol>
        </div>

        <MotionReveal
          as="aside"
          variants={fadeRight}
          delay={0.15}
          className="rounded-2xl bg-[var(--color-surface)] p-6 sm:p-8"
        >
          <h2
            id="benefits-heading"
            className="mb-5 text-center text-lg font-extrabold text-[var(--color-primary)] sm:text-xl lg:whitespace-nowrap"
          >
            What You Get at YogiSpeaks
          </h2>
          <ul className="space-y-3">
            {benefits.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-[var(--color-text)]">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-[var(--color-success)] bg-transparent text-[var(--color-success)]">
                  <Check className="size-3" aria-hidden="true" strokeWidth={2.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </MotionReveal>
      </div>
    </section>
  );
}
