import Link from 'next/link';
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { WhatsAppIcon } from '@/components/home/WhatsAppButton';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';
import { navLinks, programs, siteContact, socialLinks } from '@/data/homepage';

const icons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: WhatsAppIcon,
};

function programHref(slug: string) {
  if (slug === 'spoken-english' || slug === 'ielts-preparation') {
    return `/courses/${slug}`;
  }
  return '/courses';
}

export function SiteFooter() {
  return (
    <footer
      id="newsletter"
      className="bg-[var(--color-primary-dark)] text-[var(--color-on-dark-muted)]"
    >
      <div className="mx-auto grid max-w-[var(--container-width)] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <BrandLogo inverted size="sm" className="mb-4" />
          <p className="mb-4 text-sm leading-relaxed">
            Professional communication coaching that builds fluency, confidence,
            and career-ready presence.
          </p>
          <ul className="flex gap-3">
            {socialLinks.map((link) => {
              const Icon = icons[link.icon];
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="inline-flex size-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Quick Links
          </h2>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="hover:text-[var(--color-accent)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Our Programs
          </h2>
          <ul className="space-y-2 text-sm">
            {programs.map((program) => (
              <li key={program.slug}>
                <Link
                  href={programHref(program.slug)}
                  className="hover:text-[var(--color-accent)]"
                >
                  {program.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Contact Us
          </h2>
          <ul className="space-y-2 text-sm">
            <li>{siteContact.address}</li>
            <li>
              <Link href="/contact" className="hover:text-[var(--color-accent)]">
                Contact form
              </Link>
            </li>
            <li>
              <a
                href={siteContact.emailHref}
                className="inline-flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <Mail className="size-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                {siteContact.email}
              </a>
            </li>
            <li>
              <a
                href={siteContact.phoneHref}
                className="inline-flex items-center gap-2 hover:text-[var(--color-accent)]"
              >
                <Phone className="size-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                {siteContact.phone}
              </a>
            </li>
            <li>{siteContact.hours}</li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Stay Connected
          </h2>
          <p className="mb-3 text-sm">
            Get coaching tips and program updates in your inbox.
          </p>
          <NewsletterForm source="footer" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--container-width)] flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs sm:px-6">
          <p>&copy; {new Date().getFullYear()} YogiSpeaks. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-[var(--color-accent)]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-accent)]">
              Terms
            </Link>
            <Link href="/refund-policy" className="hover:text-[var(--color-accent)]">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
