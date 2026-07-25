/** Resolve CMS media paths (e.g. /uploads/…) to absolute URLs for the browser. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const apiBase = (
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  ).replace(/\/api\/v1\/?$/, '');
  return `${apiBase}${url.startsWith('/') ? url : `/${url}`}`;
}
