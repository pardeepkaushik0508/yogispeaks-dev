import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
} from 'lucide-react';
import { siteContact, socialLinks } from '@/data/homepage';

const icons = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  whatsapp: MessageCircle,
};

export function TopBar() {
  return (
    <div className="bg-[var(--color-primary-dark)] text-[var(--color-on-dark-muted)]">
      <div className="mx-auto flex max-w-[var(--container-width)] flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm sm:px-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a
            href={siteContact.phoneHref}
            className="transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {siteContact.phone}
          </a>
          <a
            href={siteContact.emailHref}
            className="transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            {siteContact.email}
          </a>
        </div>
        <ul className="flex items-center gap-3">
          {socialLinks.map((link) => {
            const Icon = icons[link.icon];
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex size-7 items-center justify-center rounded-full text-white/80 transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                >
                  <Icon className="size-3.5" aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
