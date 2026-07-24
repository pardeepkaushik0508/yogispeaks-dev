'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch, ApiError } from '@/lib/api-client';
import type { AdminUser } from '@/lib/admin-auth';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(12),
});

type LoginForm = z.infer<typeof loginSchema>;

/**
 * Admin login page.
 * Stores the short-lived access token in memory/sessionStorage only —
 * refresh tokens stay in HttpOnly cookies set by the API.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const { completeLogin } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      const result = await apiFetch<{
        accessToken: string;
        user: AdminUser;
      }>('/auth/login', {
        method: 'POST',
        body: values,
      });

      // Update auth context before navigating — otherwise the guard sees
      // user=null on /admin/dashboard and bounces back to login.
      completeLogin(result.accessToken, result.user);
      router.replace('/admin/dashboard');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Unable to sign in. Please try again.';
      setError(message);
    }
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-primary-dark)] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]"
        noValidate
      >
        <p className="text-sm font-semibold tracking-wide text-[var(--color-accent)]">
          YogiSpeaks Admin
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[var(--color-text)]">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Manage courses, blogs, enquiries and website content.
        </p>

        <label className="mt-6 block text-sm font-medium text-[var(--color-text)]">
          Email
          <input
            type="email"
            autoComplete="username"
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
            {...register('email')}
          />
        </label>
        {errors.email ? (
          <p className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
            {errors.email.message}
          </p>
        ) : null}

        <label className="mt-4 block text-sm font-medium text-[var(--color-text)]">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
            {...register('password')}
          />
        </label>
        {errors.password ? (
          <p className="mt-1 text-sm text-[var(--color-danger)]" role="alert">
            {errors.password.message}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-[var(--color-danger)]" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-[var(--radius-md)] bg-[var(--color-accent)] px-4 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
          <a
            href="/admin/forgot-password"
            className="text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            Forgot password?
          </a>
        </p>
      </form>
    </main>
  );
}
