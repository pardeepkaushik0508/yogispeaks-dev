'use client';

import DOMPurify from 'isomorphic-dompurify';
import { cn } from '@/lib/cn';

export function RichHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  return (
    <div
      className={cn(
        'rich-html space-y-3 text-[var(--color-muted)] [&_li]:ml-5 [&_li]:list-disc [&_p]:leading-relaxed [&_strong]:text-[var(--color-text)]',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
