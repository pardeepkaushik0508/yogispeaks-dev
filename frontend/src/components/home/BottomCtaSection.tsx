'use client';

import { CalendarDays, Phone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { bottomCta } from '@/data/homepage';
import { MotionReveal, scaleIn } from '@/components/home/motion';

export function BottomCtaSection() {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className="relative z-20 bg-transparent pt-14 sm:pt-16"
    >
      <div className="relative z-20 mx-auto w-full max-w-[var(--container-width)] px-4 sm:px-6">
        <MotionReveal
          variants={scaleIn}
          className="relative z-20 -mb-[80px] rounded-2xl bg-[var(--color-primary-dark)] px-6 py-8 text-[var(--color-on-dark)] sm:px-8 sm:py-9 lg:px-10 lg:py-10"
        >
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-0">
            <div className="min-w-0 overflow-hidden lg:pr-8 xl:pr-10">
              <h2
                id="bottom-cta-heading"
                className="mb-2 whitespace-nowrap text-sm font-semibold tracking-tight sm:text-base lg:text-[1.05rem] xl:text-[1.15rem] lg:leading-snug"
              >
                {bottomCta.heading}
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
                {bottomCta.description}
              </p>
            </div>

            <div className="flex items-center gap-3 border-white/15 lg:border-l lg:px-6 xl:px-8">
              <Phone
                className="size-11 shrink-0 text-[var(--color-accent)] sm:size-12"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold leading-snug text-white sm:text-[0.95rem]">
                Free
                <br />
                Communication
                <br />
                Assessment
              </p>
            </div>

            <div className="flex items-center gap-3 border-white/15 lg:border-l lg:px-6 xl:px-8">
              <CalendarDays
                className="size-8 shrink-0 text-[var(--color-accent)]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <p className="text-sm font-semibold leading-snug text-white sm:text-[0.95rem]">
                Personalized
                <br />
                Learning Plan
              </p>
            </div>

            <div className="border-white/15 lg:border-l lg:pl-6 xl:pl-8">
              <ButtonLink
                href={bottomCta.ctaHref}
                className="h-auto w-full min-w-[16rem] max-w-[18rem] flex-col gap-1.5 px-6 py-3.5 text-center leading-snug lg:w-auto"
              >
                <span className="flex flex-col items-center text-white">
                  <span className="text-base font-semibold sm:text-[1.05rem]">
                    Book Your Free
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold sm:text-[0.9rem]">
                    Communication Assessment
                    <span aria-hidden="true">→</span>
                  </span>
                </span>
                <span className="text-[11px] font-medium text-white/90">
                  {bottomCta.reassurance}
                </span>
              </ButtonLink>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
