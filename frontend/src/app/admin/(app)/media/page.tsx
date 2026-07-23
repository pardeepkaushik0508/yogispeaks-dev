'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';
import { getAccessToken } from '@/lib/admin-auth';
import { publicEnv } from '@/lib/env';

type MediaRow = {
  id: string;
  url: string;
  title?: string | null;
  alt?: string | null;
  mimeType: string;
};

export default function MediaAdminPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<{ items: MediaRow[] }>('/admin/media?pageSize=100');
      setRows(data.items);
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    } finally {
      setLoading(false);
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onUpload(file: File) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch(
        `${publicEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/admin/media/upload`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
          body: form,
        },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      push('Uploaded');
      await load();
    } catch (err) {
      push(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <PermissionGate
      permission="media.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Media</h2>
          <p className="text-sm text-slate-500">Upload and manage assets.</p>
        </div>
        <label className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
          {busy ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onUpload(f);
            }}
          />
        </label>
      </div>
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            rows={rows}
            columns={[
              {
                key: 'preview',
                header: 'Preview',
                render: (r) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      r.url.startsWith('http')
                        ? r.url
                        : `${publicEnv.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, '')}${r.url}`
                    }
                    alt={r.alt ?? ''}
                    className="size-12 rounded object-cover"
                  />
                ),
              },
              {
                key: 'title',
                header: 'Title',
                render: (r) => String(r.title ?? r.alt ?? ''),
              },
              { key: 'mime', header: 'Type', render: (r) => r.mimeType },
              {
                key: 'actions',
                header: '',
                render: (r) => (
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => setDeleteId(r.id)}
                  >
                    Delete
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>
      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete media"
        message="Soft-delete this asset?"
        confirmLabel="Delete"
        busy={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          setBusy(true);
          try {
            await mutate(`/admin/media/${deleteId}`, 'DELETE');
            push('Deleted');
            setDeleteId(null);
            await load();
          } catch (err) {
            push(err instanceof ApiError ? err.message : 'Delete failed', 'error');
          } finally {
            setBusy(false);
          }
        }}
      />
    </PermissionGate>
  );
}
