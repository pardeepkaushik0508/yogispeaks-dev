import { ClipboardCheck, Route } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { bottomCta } from '@/data/homepage';

export function BottomCtaSection() {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className="bg-[var(--color-primary-dark)] py-14 text-[var(--color-on-dark)] sm:py-16"
    >
      <div className="mx-auto max-w-[var(--container-width)] px-4 text-center sm:px-6">
        <h2
          id="bottom-cta-heading"
          className="mb-3 font-[family-name:var(--font-montserrat)] text-3xl font-extrabold tracking-tight sm:text-4xl"
        >
          {bottomCta.heading}
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-[var(--color-on-dark-muted)]">
          {bottomCta.description}
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-on-dark-muted)]">
          <span className="inline-flex items-center gap-2">
            <ClipboardCheck className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
            {bottomCta.highlights[0]}
          </span>
          <span className="inline-flex items-center gap-2">
            <Route className="size-4 text-[var(--color-accent)]" aria-hidden="true" />
            {bottomCta.highlights[1]}
          </span>
        </div>

        <ButtonLink href={bottomCta.ctaHref} arrow className="px-7 py-3.5 text-base">
          {bottomCta.ctaLabel}
        </ButtonLink>
        <p className="mt-4 text-xs text-[var(--color-on-dark-muted)]">
          {bottomCta.reassurance}
        </p>
      </div>
    </section>
  );
}
