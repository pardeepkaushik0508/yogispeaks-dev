/** Deployed Nest API base (versioned). Override via NEXT_PUBLIC_API_URL. */
export const DEFAULT_API_URL =
  'https://yogispeaks-backend.onrender.com/api/v1';

/** Origin used for /uploads and other non-/api paths. */
export function apiOriginFromApiUrl(apiUrl: string): string {
  return apiUrl.replace(/\/api\/v1\/?$/, '');
}
