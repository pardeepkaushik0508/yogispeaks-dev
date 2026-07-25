'use client';

import { useCallback, useEffect, useState } from 'react';
import { FileText } from 'lucide-react';
import { apiFetch, ApiError } from '@/lib/api-client';
import { getAccessToken } from '@/lib/admin-auth';
import { useToast } from '@/components/admin/Toast';
import { publicEnv } from '@/lib/env';

export type MediaAsset = {
  id: string;
  url: string;
  mimeType: string;
  alt?: string | null;
  title?: string | null;
  byteSize: number;
};

export function absoluteMediaUrl(url: string) {
  if (url.startsWith('http')) return url;
  const api = String(publicEnv.NEXT_PUBLIC_API_URL || '').replace(
    /\/api\/v1\/?$/,
    '',
  );
  return `${api}${url.startsWith('/') ? url : `/${url}`}`;
}

function isImage(mime?: string | null) {
  return !!mime && mime.startsWith('image/');
}

export function MediaPicker({
  value,
  onChange,
  label = 'Media',
  accept = 'image/*',
  hint,
}: {
  value?: string | null;
  onChange: (id: string | null, asset?: MediaAsset | null) => void;
  label?: string;
  /** File input accept attribute, e.g. image/* or .pdf,application/pdf,image/* */
  accept?: string;
  hint?: string;
}) {
  const { push } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiFetch<{ items: MediaAsset[] } | MediaAsset[]>(
        '/admin/media?pageSize=50',
        { accessToken: getAccessToken() ?? undefined },
      );
      const list = Array.isArray(data) ? data : data.items;
      setItems(list);
      if (value) {
        setSelected(list.find((m) => m.id === value) ?? null);
      }
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load media', 'error');
    }
  }, [push, value]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(
        `${String(publicEnv.NEXT_PUBLIC_API_URL).replace(/\/$/, '')}/admin/media/upload`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${getAccessToken() ?? ''}`,
          },
          body: form,
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      const asset = (json.data ?? json) as MediaAsset;
      setItems((prev) => [asset, ...prev]);
      onChange(asset.id, asset);
      setSelected(asset);
      push('Uploaded');
      setOpen(false);
    } catch (err) {
      push(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-slate-800">{label}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      <div className="mt-2 flex items-center gap-3">
        {selected ? (
          isImage(selected.mimeType) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={absoluteMediaUrl(selected.url)}
              alt={selected.alt ?? ''}
              className="size-16 rounded object-cover"
            />
          ) : (
            <div className="flex size-16 flex-col items-center justify-center rounded bg-slate-100 text-[var(--color-primary)]">
              <FileText className="size-6" aria-hidden />
              <span className="mt-0.5 max-w-[3.5rem] truncate px-1 text-[9px]">
                {selected.title || 'File'}
              </span>
            </div>
          )
        ) : (
          <div className="flex size-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">
            None
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          Choose / Upload
        </button>
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange(null, null);
              setSelected(null);
            }}
            className="text-sm text-red-600"
          >
            Clear
          </button>
        ) : null}
      </div>
      {selected?.url ? (
        <a
          href={absoluteMediaUrl(selected.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-slate-600 underline"
        >
          Open current file
        </a>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-lg bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Media library</h3>
              <button type="button" onClick={() => setOpen(false)} className="text-sm">
                Close
              </button>
            </div>
            <label className="mt-4 inline-flex cursor-pointer rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
              {uploading ? 'Uploading…' : 'Upload file'}
              <input
                type="file"
                accept={accept}
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onUpload(f);
                }}
              />
            </label>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className="w-full overflow-hidden rounded border border-slate-200 text-left hover:border-slate-900"
                    onClick={() => {
                      onChange(item.id, item);
                      setSelected(item);
                      setOpen(false);
                    }}
                  >
                    {isImage(item.mimeType) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={absoluteMediaUrl(item.url)}
                        alt={item.alt ?? ''}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-square w-full flex-col items-center justify-center gap-1 bg-slate-50 p-2 text-center">
                        <FileText className="size-8 text-slate-500" aria-hidden />
                        <span className="line-clamp-2 text-[10px] text-slate-600">
                          {item.title || item.mimeType}
                        </span>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
