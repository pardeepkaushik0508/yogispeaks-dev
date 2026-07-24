'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { bookAssessmentHref, navLinks } from '@/data/homepage';
import { BrandLogo } from '@/components/BrandLogo';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { cn } from '@/lib/cn';

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-5" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-[3px] block h-[2px] w-5 rounded-full bg-current"
        animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      />
      <motion.span
        className="absolute left-0 top-[9px] block h-[2px] w-5 rounded-full bg-current"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.18 }}
      />
      <motion.span
        className="absolute left-0 top-[15px] block h-[2px] w-5 rounded-full bg-current"
        animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      />
    </span>
  );
}

export function SiteHeader() {
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCoursesOpen(false);
  };

  return (
    <header
      className={cn(
        'sticky top-0 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm',
        mobileOpen ? 'z-[100]' : 'z-40',
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[var(--container-width)] items-center justify-between gap-3 px-4 sm:h-[4.75rem] sm:gap-4 sm:px-6">
        {/* Logo — shrinks safely, no overlap */}
        <div className="min-w-0 flex-1 overflow-hidden lg:flex-none">
          <BrandLogo
            showTagline
            priority
            className="max-w-full"
            taglineClassName="hidden lg:block"
          />
        </div>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.label} className="relative">
                {link.children ? (
                  <div
                    className="group relative"
                    onMouseEnter={() => setCoursesOpen(true)}
                    onMouseLeave={() => setCoursesOpen(false)}
                  >
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                      aria-expanded={coursesOpen}
                      aria-haspopup="true"
                      onClick={() => setCoursesOpen((v) => !v)}
                    >
                      {link.label}
                      <ChevronDown className="size-3.5" aria-hidden="true" />
                    </button>
                    <ul
                      className={cn(
                        'absolute left-1/2 top-full z-50 min-w-56 -translate-x-1/2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-2 shadow-[var(--shadow-card)]',
                        coursesOpen ? 'block' : 'hidden',
                      )}
                    >
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Desktop only — avoids overlap with hamburger on tablet/mobile */}
          <ButtonLink
            href={bookAssessmentHref}
            variant="header"
            className="hidden rounded-md px-5 py-2.5 lg:inline-flex"
          >
            BOOK FREE ASSESSMENT
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-primary)] shadow-sm transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] sm:size-11 lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-[110] flex flex-col bg-white lg:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <div className="flex h-[4.25rem] shrink-0 items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 sm:h-[4.75rem] sm:px-6">
              <BrandLogo showTagline={false} onClick={closeMobile} />
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-primary)] sm:size-11"
                aria-label="Close menu"
                onClick={closeMobile}
              >
                <HamburgerIcon open />
              </button>
            </div>

            <nav aria-label="Mobile" className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <motion.ul
                className="mx-auto flex max-w-lg flex-col gap-1"
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: reduceMotion ? 0 : 0.05 },
                  },
                }}
              >
                {navLinks.map((link) => (
                  <motion.li
                    key={link.label}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    {link.children ? (
                      <div>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-left text-base font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface)]"
                          aria-expanded={mobileCoursesOpen}
                          onClick={() => setMobileCoursesOpen((v) => !v)}
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              'size-4 transition-transform duration-300',
                              mobileCoursesOpen && 'rotate-180',
                            )}
                            aria-hidden="true"
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileCoursesOpen ? (
                            <motion.ul
                              className="mb-1 ml-2 overflow-hidden border-l-2 border-[var(--color-accent)]/40 pl-3"
                              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.28, ease: 'easeInOut' }}
                            >
                              {link.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className="block rounded-lg px-2 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                                    onClick={closeMobile}
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block rounded-xl px-3 py-3.5 text-base font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-accent)]"
                        onClick={closeMobile}
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="shrink-0 border-t border-[var(--color-border)] bg-white p-4 sm:p-6">
              <ButtonLink
                href={bookAssessmentHref}
                variant="header"
                className="w-full"
                onClick={closeMobile}
              >
                BOOK FREE ASSESSMENT
              </ButtonLink>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
