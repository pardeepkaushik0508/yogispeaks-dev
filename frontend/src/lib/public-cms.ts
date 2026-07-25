import { apiFetch } from '@/lib/api-client';
import type {
  CmsBlogCategory,
  CmsBlogPost,
  CmsCourse,
  CmsFaq,
  CmsPage,
  CmsTestimonial,
} from '@/lib/cms-types';

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
  secondaryLabel?: string;
  secondaryHref?: string;
} {
  if (items && typeof items === 'object' && !Array.isArray(items)) {
    const o = items as Record<string, unknown>;
    return {
      buttonLabel: typeof o.buttonLabel === 'string' ? o.buttonLabel : undefined,
      buttonHref: typeof o.buttonHref === 'string' ? o.buttonHref : undefined,
      secondaryLabel:
        typeof o.secondaryLabel === 'string' ? o.secondaryLabel : undefined,
      secondaryHref:
        typeof o.secondaryHref === 'string' ? o.secondaryHref : undefined,
    };
  }
  return {};
}

export function asBlockMeta(items: unknown): Record<string, string> {
  if (items && typeof items === 'object' && !Array.isArray(items)) {
    const o = items as Record<string, unknown>;
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(o)) {
      if (typeof value === 'string') out[key] = value;
    }
    return out;
  }
  return {};
}

export async function fetchVisibleFaqs(): Promise<CmsFaq[]> {
  try {
    const rows = await apiFetch<CmsFaq[]>(`/public/faqs`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
    return rows.filter((f) => !f.courseId);
  } catch {
    return [];
  }
}

export async function fetchBlogPosts(): Promise<CmsBlogPost[]> {
  try {
    return await apiFetch<CmsBlogPost[]>(`/public/blogs`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return [];
  }
}

export async function fetchBlogPost(slug: string): Promise<CmsBlogPost | null> {
  try {
    return await apiFetch<CmsBlogPost>(`/public/blogs/${slug}`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return null;
  }
}

export async function fetchBlogCategories(): Promise<CmsBlogCategory[]> {
  try {
    return await apiFetch<CmsBlogCategory[]>(`/public/blog-categories`, {
      credentials: 'omit',
      next: { revalidate: 60 },
    } as RequestInit & { next?: { revalidate: number } });
  } catch {
    return [];
  }
}

export type InquiryPayload = {
  fullName?: string;
  name?: string;
  email: string;
  mobile?: string;
  phone?: string;
  preferredCourse?: string;
  currentLevel?: string;
  preferredTiming?: string;
  learningGoal?: string;
  country?: string;
  type?: 'ASSESSMENT' | 'CONTACT';
  sourcePage?: string;
};

export async function submitInquiry(body: InquiryPayload): Promise<void> {
  await apiFetch(`/public/inquiries`, {
    method: 'POST',
    body,
    credentials: 'omit',
  });
}

export async function subscribeNewsletter(
  email: string,
  source?: string,
): Promise<void> {
  await apiFetch(`/public/newsletter`, {
    method: 'POST',
    body: { email, source },
    credentials: 'omit',
  });
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
