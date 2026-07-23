'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';

export type CrudField = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
};

type Row = { id: string; [key: string]: unknown };

export function AdminCrudPage({
  title,
  permission,
  endpoint,
  columns,
  fields,
  mapRow,
  transformCreate,
}: {
  title: string;
  permission: string;
  endpoint: string;
  columns: { key: string; header: string; render: (row: Row) => React.ReactNode }[];
  fields: CrudField[];
  mapRow?: (raw: unknown) => Row[];
  transformCreate?: (form: Record<string, string>) => Record<string, unknown>;
}) {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get<unknown>(endpoint);
      if (mapRow) setRows(mapRow(data));
      else if (Array.isArray(data)) setRows(data as Row[]);
      else if (data && typeof data === 'object' && 'items' in data) {
        setRows((data as { items: Row[] }).items);
      } else setRows([]);
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    } finally {
      setLoading(false);
    }
  }, [endpoint, get, mapRow, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    setBusy(true);
    try {
      const body = transformCreate ? transformCreate(form) : form;
      await mutate(endpoint, 'POST', body);
      push('Created');
      setFormOpen(false);
      setForm({});
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Save failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!deleteId) return;
    setBusy(true);
    try {
      await mutate(`${endpoint}/${deleteId}`, 'DELETE');
      push('Deleted');
      setDeleteId(null);
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Delete failed', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <PermissionGate
      permission={permission}
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">Manage {title.toLowerCase()}.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Add new
        </button>
      </div>
      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : (
          <DataTable
            rows={rows}
            columns={[
              ...columns,
              {
                key: 'actions',
                header: '',
                render: (row) => (
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => setDeleteId(row.id)}
                  >
                    Delete
                  </button>
                ),
              },
            ]}
          />
        )}
      </div>

      {formOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold">New {title}</h3>
            <div className="mt-4 space-y-3">
              {fields.map((field) => (
                <label key={field.name} className="block text-sm font-medium">
                  {field.label}
                  {field.type === 'textarea' ? (
                    <textarea
                      className="mt-1 w-full rounded-md border px-3 py-2"
                      rows={4}
                      value={form[field.name] ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.name]: e.target.value }))
                      }
                    />
                  ) : field.type === 'select' ? (
                    <select
                      className="mt-1 w-full rounded-md border px-3 py-2"
                      value={form[field.name] ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.name]: e.target.value }))
                      }
                    >
                      <option value="">Select…</option>
                      {field.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      className="mt-1 w-full rounded-md border px-3 py-2"
                      value={form[field.name] ?? ''}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.name]: e.target.value }))
                      }
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void save()}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete record"
        message="This cannot be undone."
        confirmLabel="Delete"
        busy={busy}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void remove()}
      />
    </PermissionGate>
  );
}
