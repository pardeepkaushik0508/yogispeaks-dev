'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch, ApiError } from '@/lib/api-client';

const schema = z.object({
  email: z.email(),
});

type FormValues = z.infer<typeof schema>;

/**
 * Admin forgot-password page.
 * Always shows a generic success message to avoid account enumeration.
 */
export default function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: values,
      });
      setDone(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to submit request. Please try again.',
      );
    }
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] px-4">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Forgot password
        </h1>
        {done ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            If an account exists for that email, password reset instructions
            have been sent.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6" noValidate>
            <label className="block text-sm font-medium">
              Email
              <input
                type="email"
                className="mt-1 w-full rounded-[var(--radius-md)] border px-3 py-2"
                {...register('email')}
              />
            </label>
            {error ? (
              <p className="mt-3 text-sm text-[var(--color-danger)]" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-3 font-semibold text-white"
            >
              Send reset link
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm">
          <a href="/admin/login" className="underline">
            Back to login
          </a>
        </p>
      </div>
    </main>
  );
}
