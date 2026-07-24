'use client';

import Link from 'next/link';
import { cn } from '@/lib/cn';
import { useAssessmentModal } from '@/components/home/AssessmentModal';
import { bookAssessmentHref } from '@/data/homepage';

type Variant = 'primary' | 'ghost-light' | 'ghost-dark' | 'header';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] shadow-sm',
  'ghost-light':
    'border border-[var(--color-accent)] bg-transparent text-white hover:bg-[var(--color-accent)]/10',
  'ghost-dark':
    'border border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-surface)]',
  header:
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] uppercase tracking-wide text-sm',
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
  /** Force opening the assessment modal even if href is not the book link */
  openAssessment?: boolean;
};

function isAssessmentHref(href: string) {
  return href === bookAssessmentHref || href.startsWith(bookAssessmentHref.split('?')[0]);
}

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  arrow,
  onClick,
  openAssessment,
}: Props) {
  const { openAssessment: openModal } = useAssessmentModal();
  const shouldOpenAssessment = openAssessment ?? isAssessmentHref(href);

  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 py-3 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
    variants[variant],
    className,
  );

  const arrowEl = arrow ? (
    <span aria-hidden="true" className="hidden sm:inline">
      →
    </span>
  ) : null;

  const handleClick = (e: React.MouseEvent) => {
    if (shouldOpenAssessment) {
      e.preventDefault();
      onClick?.();
      openModal();
      return;
    }
    onClick?.();
  };

  if (shouldOpenAssessment) {
    return (
      <button type="button" className={classes} onClick={handleClick}>
        {children}
        {arrowEl}
      </button>
    );
  }

  const isExternal =
    href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  if (isExternal) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={classes}
        onClick={onClick}
      >
        {children}
        {arrowEl}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
      {arrowEl}
    </Link>
  );
}
