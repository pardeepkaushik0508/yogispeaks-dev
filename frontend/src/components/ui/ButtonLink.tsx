import Link from 'next/link';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'ghost-light' | 'ghost-dark' | 'header';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] shadow-sm',
  'ghost-light':
    'border border-white/70 bg-transparent text-white hover:bg-white/10',
  'ghost-dark':
    'border border-[var(--color-primary)]/20 bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-surface)]',
  header:
    'bg-[var(--color-accent)] text-[var(--color-primary)] hover:bg-[var(--color-accent-hover)] uppercase tracking-wide text-sm',
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  arrow,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 py-3 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
        variants[variant],
        className,
      )}
    >
      {children}
      {arrow ? <span aria-hidden="true">→</span> : null}
    </Link>
  );
}
