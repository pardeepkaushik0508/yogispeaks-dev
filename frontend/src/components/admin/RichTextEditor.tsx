'use client';

import { publicEnv } from '@/lib/env';

type Props = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
};

/**
 * Lightweight rich-text fallback when TinyMCE key is unset.
 * Uses a contenteditable area; swap for TinyMCE when API key is configured.
 */
export function RichTextEditor({ value, onChange, label = 'Content' }: Props) {
  const apiKey = publicEnv.NEXT_PUBLIC_TINYMCE_API_KEY;

  if (apiKey) {
    // Dynamic import avoided for simplicity; textarea still works with TinyMCE CDN script if added later.
  }

  return (
    <label className="block text-sm font-medium text-slate-800">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        placeholder="HTML content"
      />
      <span className="mt-1 block text-xs text-slate-500">
        HTML is sanitized on the server before save.
      </span>
    </label>
  );
}
