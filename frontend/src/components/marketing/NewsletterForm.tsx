'use client';

import { useState } from 'react';
import { subscribeNewsletter } from '@/lib/public-cms';
import { ApiError } from '@/lib/api-client';
import { cn } from '@/lib/cn';

type Props = {
  source: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

export function NewsletterForm({
  source,
  className,
  inputClassName,
  buttonClassName,
}: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      await subscribeNewsletter(email.trim(), source);
      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    }
  }

  return (
    <form className={cn('flex flex-col gap-2', className)} onSubmit={onSubmit}>
      <label htmlFor={`newsletter-${source}`} className="sr-only">
        Email address
      </label>
      <input
        id={`newsletter-${source}`}
        name="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        disabled={status === 'loading'}
        className={cn(
          'rounded-[var(--radius-md)] border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]',
          inputClassName,
        )}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className={cn(
          'rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:opacity-70',
          buttonClassName,
        )}
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {message ? (
        <p
          className={cn(
            'text-xs',
            status === 'error' ? 'text-red-300' : 'text-[var(--color-accent)]',
          )}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
