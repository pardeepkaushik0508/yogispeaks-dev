'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { MediaPicker } from '@/components/admin/MediaPicker';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { FormSkeleton } from '@/components/ui/Skeleton';
import { ButtonSpinner } from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api-client';

type Block = {
  key: string;
  title?: string | null;
  subtitle?: string | null;
  bodyHtml?: string | null;
  itemsJson?: unknown;
  sortOrder?: number;
  isVisible?: boolean;
};

type PageRow = {
  id: string;
  title: string;
  slug: string;
  bodyHtml: string;
  status: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  heroImageId?: string | null;
  heroImage?: { id?: string; url?: string } | null;
  blocks: Block[];
};

function itemsToText(items: unknown): string {
  if (!items) return '';
  return JSON.stringify(items, null, 2);
}

function parseItems(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as unknown;
}

export default function PageEditorAdmin() {
  const params = useParams<{ id: string }>();
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [blockTexts, setBlockTexts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<PageRow>(`/admin/pages/${params.id}`);
      setPage({
        ...data,
        heroImageId: data.heroImageId || data.heroImage?.id || null,
      });
      const texts: Record<string, string> = {};
      for (const b of data.blocks || []) {
        texts[b.key] = itemsToText(b.itemsJson);
      }
      setBlockTexts(texts);
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load page', 'error');
    } finally {
      setLoading(false);
    }
  }, [get, params.id, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!page) return;
    setBusy(true);
    try {
      const blocks = (page.blocks || []).map((b, i) => ({
        key: b.key,
        title: b.title,
        subtitle: b.subtitle,
        bodyHtml: b.bodyHtml,
        itemsJson: parseItems(blockTexts[b.key] ?? ''),
        sortOrder: b.sortOrder ?? i,
        isVisible: b.isVisible ?? true,
      }));
      await mutate(`/admin/pages/${page.id}`, 'PATCH', {
        title: page.title,
        slug: page.slug,
        bodyHtml: page.bodyHtml,
        status: page.status,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        heroImageId: page.heroImageId || null,
        blocks,
      });
      push('Page saved');
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Save failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  function updateBlock(key: string, patch: Partial<Block>) {
    setPage((p) =>
      p
        ? {
            ...p,
            blocks: p.blocks.map((b) => (b.key === key ? { ...b, ...patch } : b)),
          }
        : p,
    );
  }

  function addBlock() {
    const key = `block_${Date.now()}`;
    setPage((p) =>
      p
        ? {
            ...p,
            blocks: [
              ...p.blocks,
              {
                key,
                title: 'New section',
                subtitle: '',
                bodyHtml: '',
                itemsJson: [],
                sortOrder: p.blocks.length,
                isVisible: true,
              },
            ],
          }
        : p,
    );
    setBlockTexts((t) => ({ ...t, [key]: '[]' }));
  }

  return (
    <PermissionGate
      permission="pages.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/pages" className="text-sm text-slate-500 hover:text-slate-800">
            ← Pages
          </Link>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Edit page</h2>
          <p className="text-sm text-slate-500">
            All About Us sections (and other pages) are editable here.
          </p>
        </div>
        <button
          type="button"
          disabled={busy || !page}
          onClick={() => void save()}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {busy ? <ButtonSpinner /> : null}
          {busy ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      {loading || !page ? (
        <FormSkeleton fields={8} />
      ) : (
        <div className="mt-6 space-y-6">
          <section className="rounded-md border bg-white p-4">
            <h3 className="font-semibold">Page settings & SEO</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ['title', 'Title'],
                  ['slug', 'Slug'],
                  ['metaTitle', 'Meta title'],
                  ['metaDescription', 'Meta description'],
                ] as const
              ).map(([field, label]) => (
                <label key={field} className="block text-sm font-medium sm:col-span-1">
                  {label}
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={String(page[field] ?? '')}
                    onChange={(e) => setPage({ ...page, [field]: e.target.value })}
                  />
                </label>
              ))}
              <label className="block text-sm font-medium">
                Status
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={page.status}
                  onChange={(e) => setPage({ ...page, status: e.target.value })}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </label>
              <label className="block text-sm font-medium sm:col-span-2">
                Fallback body HTML
                <textarea
                  className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                  rows={3}
                  value={page.bodyHtml}
                  onChange={(e) => setPage({ ...page, bodyHtml: e.target.value })}
                />
              </label>
            </div>
          </section>

          <section className="rounded-md border bg-white p-4">
            <MediaPicker
              label="Hero image"
              accept="image/*"
              hint="Optional banner image for this page (About, Contact, etc.)."
              value={page.heroImageId}
              onChange={(id) => setPage({ ...page, heroImageId: id })}
            />
          </section>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Content sections ({page.blocks.length})</h3>
            <button
              type="button"
              onClick={addBlock}
              className="rounded-md border px-3 py-1.5 text-sm"
            >
              Add section
            </button>
          </div>

          {page.blocks.map((block) => (
            <section key={block.key} className="rounded-md border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-slate-500">key: {block.key}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={block.isVisible ?? true}
                    onChange={(e) => updateBlock(block.key, { isVisible: e.target.checked })}
                  />
                  Visible
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Title
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={block.title ?? ''}
                    onChange={(e) => updateBlock(block.key, { title: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Subtitle
                  <input
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={block.subtitle ?? ''}
                    onChange={(e) => updateBlock(block.key, { subtitle: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  Body HTML
                  <textarea
                    className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                    rows={4}
                    value={block.bodyHtml ?? ''}
                    onChange={(e) => updateBlock(block.key, { bodyHtml: e.target.value })}
                  />
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  Items JSON (arrays of strings or {'{ title, description }'} objects; CTA uses
                  buttonLabel/buttonHref object)
                  <textarea
                    className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-xs"
                    rows={6}
                    value={blockTexts[block.key] ?? ''}
                    onChange={(e) =>
                      setBlockTexts((t) => ({ ...t, [block.key]: e.target.value }))
                    }
                  />
                </label>
              </div>
            </section>
          ))}
        </div>
      )}
    </PermissionGate>
  );
}
