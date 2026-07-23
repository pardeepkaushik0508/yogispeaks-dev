'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { navLinks } from '@/data/homepage';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { cn } from '@/lib/cn';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[4.75rem] max-w-[var(--container-width)] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
        >
          <Image
            src="/brand/logo-primary.png"
            alt="YogiSpeaks"
            width={52}
            height={52}
            className="size-12 rounded-full object-cover"
            priority
          />
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-montserrat)] text-base font-extrabold tracking-wide text-[var(--color-primary)] sm:text-lg">
              YOGISPEAKS
            </span>
            <span className="block text-[11px] tracking-wide text-[var(--color-muted)]">
              Confidence to Communicate.
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
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
                        'absolute left-0 top-full z-50 min-w-56 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white py-2 shadow-[var(--shadow-card)]',
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

        <div className="flex items-center gap-3">
          <ButtonLink
            href="/free-assessment"
            variant="header"
            className="hidden px-4 py-2.5 sm:inline-flex"
          >
            Book Free Assessment
          </ButtonLink>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-primary)] lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!mobileOpen}
        className="border-t border-[var(--color-border)] bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="mx-auto max-w-[var(--container-width)] px-4 py-4">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-2.5 text-sm font-medium text-[var(--color-text)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children ? (
                  <ul className="mb-2 ml-3 border-l border-[var(--color-border)] pl-3">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block px-2 py-1.5 text-sm text-[var(--color-muted)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/free-assessment"
            variant="header"
            className="mt-3 w-full sm:hidden"
          >
            Book Free Assessment
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
