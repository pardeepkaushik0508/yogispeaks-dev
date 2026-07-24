import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

type Props = {
  href?: string;
  showTagline?: boolean;
  inverted?: boolean;
  className?: string;
  taglineClassName?: string;
  priority?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
};

export function BrandLogo({
  href = '/',
  showTagline = false,
  inverted = false,
  className,
  taglineClassName,
  priority = false,
  size = 'md',
  onClick,
}: Props) {
  const imgSize = size === 'sm' ? 48 : 52;
  const wordmarkClass =
    size === 'sm'
      ? 'text-sm font-extrabold tracking-wide'
      : 'text-base font-extrabold tracking-wide sm:text-lg';

  const content = (
    <>
      <Image
        src="/brand/logo-primary.png"
        alt="YogiSpeaks — Communication Coaching"
        width={imgSize}
        height={imgSize}
        className={cn(
          'shrink-0 rounded-full object-cover',
          size === 'sm' ? 'size-10' : 'size-11 sm:size-12',
        )}
        priority={priority}
      />
      <span className="min-w-0 leading-tight">
        <span
          className={cn(
            wordmarkClass,
            'block truncate',
            inverted ? 'text-white' : 'text-[var(--color-primary)]',
          )}
        >
          YOGI
          <span className="text-[var(--color-accent)]">SPEAKS</span>
        </span>
        {showTagline ? (
          <span
            className={cn(
              'block truncate text-[11px] tracking-wide',
              inverted ? 'text-white/70' : 'text-[var(--color-muted)]',
              taglineClassName,
            )}
          >
            Confidence to Communicate.
          </span>
        ) : null}
      </span>
    </>
  );

  if (!href) {
    return <span className={cn('inline-flex items-center gap-2.5 sm:gap-3', className)}>{content}</span>;
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex min-w-0 max-w-full shrink items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] sm:gap-3',
        className,
      )}
    >
      {content}
    </Link>
  );
}
