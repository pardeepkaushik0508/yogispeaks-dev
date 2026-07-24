import { apiFetch } from '@/lib/api-client';
import type { CmsCourse, CmsPage, CmsTestimonial } from '@/lib/cms-types';

export async function fetchPublishedPage(slug: string): Promise<CmsPage | null> {
  try {
    return await apiFetch<CmsPage>(`/public/pages/${slug}`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return null;
  }
}

export async function fetchPublishedCourse(
  slug: string,
): Promise<CmsCourse | null> {
  try {
    return await apiFetch<CmsCourse>(`/public/courses/${slug}`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return null;
  }
}

export async function fetchPublishedCourses(): Promise<CmsCourse[]> {
  try {
    return await apiFetch<CmsCourse[]>(`/public/courses`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return [];
  }
}

export async function fetchVisibleTestimonials(): Promise<CmsTestimonial[]> {
  try {
    return await apiFetch<CmsTestimonial[]>(`/public/testimonials`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return [];
  }
}

export function getPageBlock(page: CmsPage, key: string) {
  return page.blocks.find((b) => b.key === key && b.isVisible !== false);
}

export function asItemList(
  items: unknown,
): Array<{ title: string; description?: string }> {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === 'string') return { title: item };
    if (item && typeof item === 'object' && 'title' in item) {
      const o = item as { title: string; description?: string };
      return { title: o.title, description: o.description };
    }
    return { title: String(item) };
  });
}

export function asCtaMeta(items: unknown): {
  buttonLabel?: string;
  buttonHref?: string;
} {
  if (items && typeof items === 'object' && !Array.isArray(items)) {
    const o = items as Record<string, unknown>;
    return {
      buttonLabel: typeof o.buttonLabel === 'string' ? o.buttonLabel : undefined,
      buttonHref: typeof o.buttonHref === 'string' ? o.buttonHref : undefined,
    };
  }
  return {};
}

/** Strip tags for plain-text surfaces (FAQ accordion). */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{2,}/g, '\n')
    .trim();
}
