'use client';

import { CalendarDays, Phone } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { bottomCta } from '@/data/homepage';
import { MotionReveal, scaleIn } from '@/components/home/motion';

export function BottomCtaSection() {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className="bg-[var(--color-surface)] py-12 sm:py-16"
    >
      <div className="mx-auto w-full max-w-[var(--container-width)] px-[15px] sm:px-6">
        <MotionReveal
          variants={scaleIn}
          className="rounded-2xl bg-[var(--color-primary-dark)] px-[15px] py-7 text-[var(--color-on-dark)] sm:px-8 sm:py-9 lg:px-10 lg:py-10 overflow-hidden"
        >
          <div className="grid max-w-full items-center gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-0">
            {/* Heading */}
            <div className="min-w-0 text-center lg:pr-8 lg:text-left xl:pr-10">
              <h2
                id="bottom-cta-heading"
                className="mb-2 text-[0.95rem] font-semibold leading-snug tracking-tight sm:text-base lg:whitespace-nowrap lg:text-[1.05rem] xl:text-[1.15rem]"
              >
                {bottomCta.heading}
              </h2>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-white/85 sm:text-base lg:mx-0 lg:max-w-lg">
                {bottomCta.description}
              </p>
            </div>

            {/* Features — centered stack on mobile, side columns on desktop */}
            <div className="grid grid-cols-2 gap-4 lg:contents">
              <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:border-l lg:border-white/15 lg:px-6 lg:text-left xl:px-8">
                <Phone
                  className="size-6 shrink-0 text-[var(--color-accent)] sm:size-7 lg:size-11 xl:size-12"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-[13px] font-semibold leading-snug text-white sm:text-sm lg:text-[0.95rem]">
                  <span className="lg:hidden">
                    Free Communication Assessment
                  </span>
                  <span className="hidden lg:inline">
                    Free
                    <br />
                    Communication
                    <br />
                    Assessment
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-2 text-center lg:flex-row lg:items-center lg:justify-start lg:gap-3 lg:border-l lg:border-white/15 lg:px-6 lg:text-left xl:px-8">
                <CalendarDays
                  className="size-6 shrink-0 text-[var(--color-accent)] sm:size-7 lg:size-8"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="text-[13px] font-semibold leading-snug text-white sm:text-sm lg:text-[0.95rem]">
                  <span className="lg:hidden">Personalized Learning Plan</span>
                  <span className="hidden lg:inline">
                    Personalized
                    <br />
                    Learning Plan
                  </span>
                </p>
              </div>
            </div>

            {/* CTA button */}
            <div className="lg:border-l lg:border-white/15 lg:pl-6 xl:pl-8">
              <ButtonLink
                href={bottomCta.ctaHref}
                className="mx-auto h-auto w-full max-w-sm flex-col gap-1 px-4 py-3 text-center leading-snug sm:max-w-[18rem] sm:px-6 sm:py-3.5 lg:mx-0 lg:w-auto lg:min-w-[16rem]"
              >
                <span className="flex flex-col items-center text-white">
                  <span className="text-sm font-semibold sm:text-base lg:text-[1.05rem]">
                    Book Your Free
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold sm:text-sm lg:text-[0.9rem]">
                    Communication Assessment
                    <span aria-hidden="true" className="hidden sm:inline">
                      →
                    </span>
                  </span>
                </span>
                <span className="text-[10px] font-medium text-white/90 sm:text-[11px]">
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
