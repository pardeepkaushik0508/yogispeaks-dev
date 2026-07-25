'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch, ApiError } from '@/lib/api-client';
import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/Spinner';

const schema = z
  .object({
    password: z
      .string()
      .min(12)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Must include upper, lower, and a number',
      }),
    passwordConfirmation: z.string().min(12),
  })
  .refine((v) => v.password === v.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type FormValues = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    if (!token) {
      setError('Reset token is missing from the link.');
      return;
    }
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: { token, ...values },
      });
      setDone(true);
      window.setTimeout(() => router.push('/admin/login'), 1500);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to reset password. Please try again.',
      );
    }
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow"
        noValidate
      >
        <h1 className="text-2xl font-bold text-slate-900">Reset password</h1>
        {done ? (
          <p className="mt-4 text-sm text-slate-600">
            Password updated. Redirecting to login…
          </p>
        ) : (
          <>
            <label className="mt-6 block text-sm font-medium">
              New password
              <input
                type="password"
                className="mt-1 w-full rounded-md border px-3 py-2"
                {...register('password')}
              />
            </label>
            {errors.password ? (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            ) : null}
            <label className="mt-4 block text-sm font-medium">
              Confirm password
              <input
                type="password"
                className="mt-1 w-full rounded-md border px-3 py-2"
                {...register('passwordConfirmation')}
              />
            </label>
            {errors.passwordConfirmation ? (
              <p className="mt-1 text-sm text-red-600">
                {errors.passwordConfirmation.message}
              </p>
            ) : null}
            {error ? (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-md bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Saving…' : 'Update password'}
            </button>
          </>
        )}
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader className="min-h-screen" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
