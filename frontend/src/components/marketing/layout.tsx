'use client';

import Image from 'next/image';
import { cn } from '@/lib/cn';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { bookAssessmentHref } from '@/data/homepage';
import { MotionReveal, fadeUp } from '@/components/home/motion';

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[var(--container-width)] px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block h-[3px] w-14 rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent)]/30',
        className,
      )}
    />
  );
}

export function Eyebrow({
  children,
  className,
  tone = 'gold',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'gold' | 'light' | 'dark';
}) {
  return (
    <p
      className={cn(
        'text-[11px] font-bold uppercase tracking-[0.24em] sm:text-xs',
        tone === 'gold' && 'text-[var(--color-accent)]',
        tone === 'light' && 'text-white/70',
        tone === 'dark' && 'text-[var(--color-muted)]',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function DisplayHeading({
  as: Tag = 'h1',
  children,
  className,
}: {
  as?: 'h1' | 'h2' | 'h3';
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        'font-display font-extrabold tracking-tight text-balance',
        Tag === 'h1' && 'text-[2.35rem] leading-[1.05] sm:text-5xl lg:text-[3.75rem]',
        Tag === 'h2' && 'text-3xl leading-[1.1] sm:text-4xl lg:text-[2.75rem]',
        Tag === 'h3' && 'text-xl leading-snug sm:text-2xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function AssessmentCta({
  className,
  label = 'Book Free Communication Assessment',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn('flex justify-center', className)}>
      <ButtonLink
        href={bookAssessmentHref}
        variant="primary"
        arrow
        openAssessment
        className="rounded-full px-7 py-3.5 shadow-[var(--shadow-glow-gold)]"
      >
        {label}
      </ButtonLink>
    </div>
  );
}

export function AmbientMesh({
  variant = 'dark',
}: {
  variant?: 'dark' | 'light' | 'gold';
}) {
  if (variant === 'light') {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 0% 0%, rgba(196,155,72,0.1), transparent 55%), radial-gradient(ellipse 60% 45% at 100% 100%, rgba(10,25,47,0.05), transparent 50%)',
        }}
      />
    );
  }
  if (variant === 'gold') {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 85% 15%, rgba(196,155,72,0.38), transparent 38%), radial-gradient(circle at 8% 90%, rgba(5,10,24,0.55), transparent 42%)',
        }}
      />
    );
  }
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at 12% 0%, rgba(196,155,72,0.2), transparent 42%), radial-gradient(ellipse at 92% 100%, rgba(17,34,64,0.95), transparent 48%)',
      }}
    />
  );
}

export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 opacity-[0.28]', className)}
      style={{
        backgroundImage:
          'radial-gradient(rgba(196,155,72,0.55) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        maskImage: 'linear-gradient(to bottom, black, transparent 90%)',
      }}
    />
  );
}

/** Full-bleed cinematic band with optional founder / brand imagery */
export function CinematicHero({
  eyebrow,
  title,
  description,
  children,
  media = 'founder',
  align = 'left',
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  media?: 'founder' | 'hero' | 'none';
  align?: 'left' | 'center';
}) {
  return (
    <section className="premium-grain relative min-h-[78vh] overflow-hidden bg-[var(--color-primary-dark)] text-[var(--color-on-dark)] lg:min-h-[88vh]">
      {media !== 'none' ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <Image
            src={media === 'hero' ? '/brand/hero-bg.png' : '/brand/founder-yogender.png'}
            alt=""
            fill
            priority
            sizes="100vw"
            className={cn(
              'object-cover opacity-40',
              media === 'founder'
                ? 'object-[center_20%] lg:object-[70%_15%] lg:opacity-55'
                : 'object-right opacity-50',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary-dark)] via-[var(--color-primary-dark)]/88 to-[var(--color-primary-dark)]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-dark)] via-transparent to-[var(--color-primary-dark)]/50" />
        </div>
      ) : (
        <>
          <AmbientMesh variant="gold" />
          <DotGrid />
        </>
      )}

      <Container
        className={cn(
          'relative flex min-h-[78vh] flex-col justify-end pb-16 pt-28 sm:pb-20 sm:pt-32 lg:min-h-[88vh] lg:pb-28',
          align === 'center' && 'items-center text-center',
        )}
      >
        <MotionReveal
          variants={fadeUp}
          className={cn('max-w-3xl', align === 'center' && 'mx-auto')}
        >
          <GoldRule className={cn('mb-6', align === 'center' && 'mx-auto')} />
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          <DisplayHeading className="text-white">{title}</DisplayHeading>
          {description ? (
            <div className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
              {description}
            </div>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </MotionReveal>
      </Container>
    </section>
  );
}

export function PremiumPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'premium-shine rounded-[var(--radius-2xl)] border border-white/10 bg-white/[0.04] p-6 shadow-[var(--shadow-elevated)] backdrop-blur-md sm:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MarqueeStrip({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[var(--color-primary)] py-4 text-white">
      <div className="premium-marquee-track gap-10 px-4">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-10 text-sm font-semibold tracking-wide whitespace-nowrap"
          >
            <span className="text-[var(--color-accent)]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FinalCtaBand({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  primary: { href: string; label: string; openAssessment?: boolean };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="premium-grain relative overflow-hidden bg-[var(--color-primary-dark)] py-20 text-white sm:py-28">
      <AmbientMesh variant="gold" />
      <Container className="relative max-w-3xl text-center">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <DisplayHeading as="h2" className="text-white">
          {title}
        </DisplayHeading>
        {body ? <p className="mx-auto mt-5 max-w-xl text-white/70">{body}</p> : null}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink
            href={primary.href}
            variant="primary"
            arrow
            openAssessment={primary.openAssessment}
          >
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink href={secondary.href} variant="ghost-light">
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

