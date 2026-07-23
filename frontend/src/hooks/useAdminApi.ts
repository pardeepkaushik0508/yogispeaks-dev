'use client';

import { useCallback } from 'react';
import { apiFetch } from '@/lib/api-client';
import { getAccessToken } from '@/lib/admin-auth';

/** Authenticated admin API helper. */
export function useAdminApi() {
  const token = () => getAccessToken() ?? undefined;

  const get = useCallback(
    <T,>(path: string) => apiFetch<T>(path, { accessToken: token() }),
    [],
  );

  const mutate = useCallback(
    <T,>(path: string, method: string, body?: unknown) =>
      apiFetch<T>(path, { method, body, accessToken: token() }),
    [],
  );

  return { get, mutate };
}
