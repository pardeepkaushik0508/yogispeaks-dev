import { Instagram, Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/home/WhatsAppButton';
import { siteContact, socialLinks } from '@/data/homepage';

function FacebookFill({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function YoutubeFill({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedinFill({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1-.004-4.125 2.062 2.062 0 0 1 .004 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const icons = {
  facebook: FacebookFill,
  instagram: Instagram,
  youtube: YoutubeFill,
  linkedin: LinkedinFill,
  whatsapp: WhatsAppIcon,
};

export function TopBar() {
  return (
    <div className="max-w-full overflow-x-hidden bg-[var(--color-primary-dark)] text-[var(--color-on-dark-muted)]">
      <div className="mx-auto flex max-w-[var(--container-width)] flex-col items-center gap-3 px-4 py-2.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
          <a
            href={siteContact.phoneHref}
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <Phone className="size-4 shrink-0 text-[var(--color-accent)]" strokeWidth={2.25} aria-hidden="true" />
            <span>{siteContact.phone}</span>
          </a>
          <a
            href={siteContact.emailHref}
            className="inline-flex items-center gap-2 transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <Mail className="size-4 shrink-0 text-[var(--color-accent)]" strokeWidth={2.25} aria-hidden="true" />
            <span>{siteContact.email}</span>
          </a>
        </div>

        <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-end">
          <span className="hidden text-xs font-medium tracking-wide text-white/70 sm:inline">
            Follow Us:
          </span>
          <ul className="flex items-center justify-center gap-2.5 sm:gap-3">
            {socialLinks.map((link) => {
              const Icon = icons[link.icon];
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="inline-flex size-8 items-center justify-center rounded-full text-white transition-colors hover:text-[var(--color-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
                  >
                    {link.icon === 'instagram' ? (
                      <Instagram className="size-[18px]" strokeWidth={2.5} aria-hidden="true" />
                    ) : (
                      <Icon className="size-[18px]" aria-hidden="true" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
