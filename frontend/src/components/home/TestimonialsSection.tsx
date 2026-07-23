'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/data/homepage';
import { cn } from '@/lib/cn';

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setPerView(1);
      else if (window.innerWidth < 1024) setPerView(2);
      else setPerView(3);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - perView);
  const safeIndex = Math.min(index, maxIndex);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="bg-[var(--color-primary)] py-16 text-[var(--color-on-dark)] sm:py-20"
    >
      <div className="mx-auto max-w-[var(--container-width)] px-4 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Trusted by Students & Professionals
            </p>
            <h2
              id="testimonials-heading"
              className="font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight sm:text-4xl"
            >
              Real Experiences. Real Progress.
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={safeIndex === 0}
              aria-label="Previous testimonials"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
              disabled={safeIndex >= maxIndex}
              aria-label="Next testimonials"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] disabled:opacity-40"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <ul
            className="flex transition-transform duration-500 ease-out"
            style={{
              gap: '1.25rem',
              transform: `translateX(calc(-${safeIndex} * ((100% - ${(perView - 1) * 1.25}rem) / ${perView} + 1.25rem)))`,
            }}
          >
            {testimonials.map((item) => (
              <li
                key={item.name}
                className="shrink-0 rounded-[var(--radius-md)] bg-white p-6 text-[var(--color-text)] shadow-[var(--shadow-card)]"
                style={{
                  width: `calc((100% - ${(perView - 1) * 1.25}rem) / ${perView})`,
                }}
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
                    className="inline-flex size-6 items-center justify-center rounded-full bg-[#4285F4] text-[10px] font-bold text-white"
                    aria-label="Google review"
                  >
                    G
                  </span>
                </div>
                <blockquote className="mb-5 text-sm leading-relaxed text-[var(--color-muted)]">
                  “{item.review}”
                </blockquote>
                <footer className="flex items-center gap-3">
                  <span
                    className={cn(
                      'inline-flex size-10 items-center justify-center rounded-full bg-[var(--color-primary)] font-semibold text-[var(--color-accent)]',
                    )}
                    aria-hidden="true"
                  >
                    {item.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
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
          </ul>
        </div>

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
