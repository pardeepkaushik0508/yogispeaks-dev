'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';

type Template = {
  id: string;
  key: string;
  subject: string;
  bodyHtml: string;
  description?: string | null;
};

export default function EmailTemplatesPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<Template[]>([]);
  const [editing, setEditing] = useState<Template | null>(null);

  const load = useCallback(async () => {
    try {
      setRows(await get<Template[]>('/admin/email-templates'));
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PermissionGate
      permission="email_templates.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <h2 className="text-2xl font-bold">Email templates</h2>
      <p className="text-sm text-slate-500">Transactional email bodies.</p>
      <div className="mt-6">
        <DataTable
          rows={rows}
          columns={[
            { key: 'key', header: 'Key', render: (r) => r.key },
            { key: 'subject', header: 'Subject', render: (r) => r.subject },
            {
              key: 'actions',
              header: '',
              render: (r) => (
                <button
                  type="button"
                  className="text-sm text-slate-700 underline"
                  onClick={() => setEditing(r)}
                >
                  Edit
                </button>
              ),
            },
          ]}
        />
      </div>
      {editing ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-6">
            <h3 className="font-semibold">Edit {editing.key}</h3>
            <label className="mt-4 block text-sm font-medium">
              Subject
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={editing.subject}
                onChange={(e) =>
                  setEditing({ ...editing, subject: e.target.value })
                }
              />
            </label>
            <div className="mt-4">
              <RichTextEditor
                label="Body HTML"
                value={editing.bodyHtml}
                onChange={(html) => setEditing({ ...editing, bodyHtml: html })}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="rounded-md border px-4 py-2 text-sm">
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                onClick={() => {
                  void mutate(`/admin/email-templates/${editing.id}`, 'PATCH', {
                    subject: editing.subject,
                    bodyHtml: editing.bodyHtml,
                  }).then(() => {
                    push('Saved');
                    setEditing(null);
                    void load();
                  });
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PermissionGate>
  );
}
