'use client';

import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/cn';

type Item = { question: string; answer: string };

export function FaqAccordion({ items }: { items: Item[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="w-full min-w-0 space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <div
            key={item.question}
            className={cn(
              'min-w-0 overflow-hidden rounded-[1.25rem] border transition-colors',
              isOpen
                ? 'border-[var(--color-accent)]/35 bg-white shadow-[var(--shadow-card)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)]/80 hover:border-[var(--color-accent)]/25',
            )}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full min-w-0 items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
              >
                <span className="min-w-0 flex-1 font-display text-sm font-bold text-[var(--color-primary)] sm:text-base">
                  {item.question}
                </span>
                <span
                  className={cn(
                    'inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                    isOpen
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-primary)] text-[var(--color-accent)]',
                  )}
                >
                  <Plus
                    aria-hidden
                    className={cn(
                      'size-4 transition-transform duration-300',
                      isOpen && 'rotate-45',
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-[var(--color-border)] px-5 pb-5 pt-4 text-sm leading-relaxed text-[var(--color-muted)] sm:px-6">
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
