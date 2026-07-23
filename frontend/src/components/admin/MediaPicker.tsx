'use client';

import { useCallback, useEffect, useState } from 'react';
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

function absoluteUrl(url: string) {
  if (url.startsWith('http')) return url;
  const api = publicEnv.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '');
  return `${api}${url.startsWith('/') ? url : `/${url}`}`;
}

export function MediaPicker({
  value,
  onChange,
  label = 'Media',
}: {
  value?: string | null;
  onChange: (id: string | null, asset?: MediaAsset | null) => void;
  label?: string;
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
        `${publicEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/admin/media/upload`,
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
      <div className="mt-2 flex items-center gap-3">
        {selected ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={absoluteUrl(selected.url)}
            alt={selected.alt ?? ''}
            className="size-16 rounded object-cover"
          />
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
          Choose
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
                accept="image/*"
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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={absoluteUrl(item.url)}
                      alt={item.alt ?? ''}
                      className="aspect-square w-full object-cover"
                    />
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
