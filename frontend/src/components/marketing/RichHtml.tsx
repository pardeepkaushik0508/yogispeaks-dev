'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export function RichHtml({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  const [clean, setClean] = useState('');

  useEffect(() => {
    let active = true;

    void import('dompurify').then(({ default: DOMPurify }) => {
      if (active) {
        setClean(
          DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
          }),
        );
      }
    });

    return () => {
      active = false;
    };
  }, [html]);

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
