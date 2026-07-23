import sanitizeHtml from 'sanitize-html';

/** HTML tags allowed in TinyMCE coaching content (courses, FAQs, blog posts). */
const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  'h1',
  'h2',
  'h3',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'blockquote',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'code',
  'pre',
];

/** Attribute allowlist per tag; scripts, iframes, and inline event handlers are never permitted. */
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ['href', 'title', 'target', 'rel'],
  img: ['src', 'alt', 'title', 'width', 'height'],
  th: ['colspan', 'rowspan'],
  td: ['colspan', 'rowspan'],
};

/**
 * Sanitizes rich HTML from the admin editor before persistence or rendering.
 * Strips scripts, iframes, and event-handler attributes while preserving coaching content structure.
 */
export function sanitizeRichTextHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRIBUTES,
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    enforceHtmlBoundary: true,
  });
}
