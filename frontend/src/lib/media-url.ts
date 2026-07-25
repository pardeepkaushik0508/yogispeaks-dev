import { DEFAULT_API_URL, apiOriginFromApiUrl } from './api-base';

/** Resolve CMS media paths (e.g. /uploads/…) to absolute URLs for the browser. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBase = apiOriginFromApiUrl(
    process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
  );
  return `${apiBase}${url.startsWith('/') ? url : `/${url}`}`;
}
