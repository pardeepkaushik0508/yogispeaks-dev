'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch, ApiError } from '@/lib/api-client';
import { getAccessToken } from '@/lib/admin-auth';
import { useToast } from '@/components/admin/Toast';

const schema = z
  .object({
    currentPassword: z.string().min(12),
    newPassword: z
      .string()
      .min(12)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
        message: 'Must include upper, lower, and a number',
      }),
    newPasswordConfirmation: z.string().min(12),
  })
  .refine((v) => v.newPassword === v.newPasswordConfirmation, {
    message: 'Passwords do not match',
    path: ['newPasswordConfirmation'],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const { push } = useToast();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setError(null);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: values,
        accessToken: getAccessToken() ?? undefined,
      });
      reset();
      push('Password updated');
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Unable to change password.',
      );
    }
  });

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="text-2xl font-bold text-slate-900">Change password</h2>
      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-6"
        noValidate
      >
        {(
          [
            ['currentPassword', 'Current password'],
            ['newPassword', 'New password'],
            ['newPasswordConfirmation', 'Confirm new password'],
          ] as const
        ).map(([name, label]) => (
          <label key={name} className="block text-sm font-medium">
            {label}
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2"
              {...register(name)}
            />
            {errors[name] ? (
              <span className="mt-1 block text-sm text-red-600">
                {errors[name]?.message}
              </span>
            ) : null}
          </label>
        ))}
        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
