'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/data/homepage';
import { cn } from '@/lib/cn';
import { fadeUp, MotionReveal } from '@/components/home/motion';

const GAP_REM = 1.25;

export function TestimonialsSection() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);
  const safeIndex = Math.min(index, maxIndex);
  const slideWidth = `calc((100% - ${(perView - 1) * GAP_REM}rem) / ${perView})`;
  const step = `calc(${slideWidth} + ${GAP_REM}rem)`;

  const arrowClass =
    'inline-flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-white/40 bg-white/10 text-white shadow-md backdrop-blur-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white disabled:pointer-events-none disabled:opacity-30 sm:size-12';

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="overflow-x-hidden bg-[var(--color-primary)] py-16 text-[var(--color-on-dark)] sm:py-20"
    >
      <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
        <MotionReveal className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)] sm:text-sm">
            Trusted by Students & Professionals
          </p>
          <h2
            id="testimonials-heading"
            className="mx-auto max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl"
          >
            Real Experiences. Real Progress.
          </h2>
        </MotionReveal>

        <MotionReveal variants={fadeUp} delay={0.1}>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={safeIndex === 0}
              aria-label="Previous testimonials"
              className={arrowClass}
            >
              <ChevronLeft className="size-6 sm:size-7" strokeWidth={2.25} />
            </button>

            <div className="min-w-0 flex-1 overflow-hidden">
              <motion.ul
                className="flex will-change-transform"
                style={{ gap: `${GAP_REM}rem` }}
                animate={{ x: `calc(-1 * ${safeIndex} * (${step}))` }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'tween', duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }
                }
              >
                {testimonials.map((item) => (
                  <li
                    key={item.name}
                    className="shrink-0 rounded-xl bg-white p-5 text-[var(--color-text)] shadow-[var(--shadow-card)] sm:p-6"
                    style={{ width: slideWidth, flex: `0 0 ${slideWidth}` }}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div
                        className="flex gap-0.5 text-[var(--color-accent)]"
                        aria-label={`${item.rating} out of 5 stars`}
                      >
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                      <span
                        className="select-none text-[15px] font-bold leading-none text-black"
                        aria-label="Google review"
                        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                      >
                        G
                      </span>
                    </div>
                    <blockquote className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
                      “{item.review}”
                    </blockquote>
                    <footer className="flex items-center gap-3">
                      <Image
                        src={item.avatar}
                        alt={`${item.name}, ${item.designation}`}
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover"
                      />
                      <span>
                        <span className="block text-sm font-semibold text-[var(--color-text)]">
                          {item.name}
                        </span>
                        <span className="block text-xs text-[var(--color-muted)]">
                          {item.designation}
                        </span>
                      </span>
                    </footer>
                  </li>
                ))}
              </motion.ul>
            </div>

            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
              disabled={safeIndex >= maxIndex}
              aria-label="Next testimonials"
              className={arrowClass}
            >
              <ChevronRight className="size-6 sm:size-7" strokeWidth={2.25} />
            </button>
          </div>
        </MotionReveal>

        <div
          className="mt-6 flex justify-center gap-2"
          role="tablist"
          aria-label="Testimonial pages"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === safeIndex}
              aria-label={`Show testimonials set ${i + 1}`}
              className={cn(
                'size-2.5 rounded-full transition-colors',
                i === safeIndex ? 'bg-[var(--color-accent)]' : 'bg-white/30',
              )}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
