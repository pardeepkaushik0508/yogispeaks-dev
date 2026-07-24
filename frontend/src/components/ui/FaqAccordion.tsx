'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type Item = { question: string; answer: string };

export function FaqAccordion({ items }: { items: Item[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="w-full min-w-0 divide-y divide-[var(--color-border)]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div key={item.question} className="min-w-0">
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full min-w-0 items-center justify-between gap-3 py-4 text-left text-sm font-semibold text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="min-w-0 flex-1 break-words">{item.question}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'size-4 shrink-0 text-[var(--color-accent)] transition-transform',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="min-w-0 break-words pb-4 text-sm leading-relaxed text-[var(--color-muted)]"
            >
              {isOpen ? item.answer : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
