import { publicEnv } from '@/lib/env';

/** Error thrown when the NestJS API returns a non-2xx response. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  /** When true, sends credentials so HttpOnly refresh cookies are included. */
  credentials?: RequestCredentials;
  accessToken?: string;
};

type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: unknown;
};

/**
 * Typed JSON fetch wrapper for the YogiSpeaks NestJS API.
 *
 * Unwraps the standard `{ success, data }` envelope from the backend.
 *
 * @param path - Path relative to `NEXT_PUBLIC_API_URL` (e.g. `/auth/login`).
 * @param options - Fetch options; `body` is JSON-serialized when set.
 * @returns The `data` field from a successful API response.
 * @throws {ApiError} When the response status is not ok.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const baseUrl = publicEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  const { body, headers, accessToken, credentials = 'include', ...rest } =
    options;

  const response = await fetch(url, {
    ...rest,
    credentials,
    headers: {
      Accept: 'application/json',
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText || `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    'data' in payload
  ) {
    return (payload as ApiEnvelope<T>).data;
  }

  return payload as T;
}
