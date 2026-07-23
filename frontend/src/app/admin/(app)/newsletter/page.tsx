'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';

type Sub = { id: string; email: string; status: string; createdAt: string };

export default function NewsletterAdminPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<Sub[]>([]);

  const load = useCallback(async () => {
    try {
      setRows(await get<Sub[]>('/admin/newsletter'));
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PermissionGate
      permission="newsletter.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <h2 className="text-2xl font-bold">Newsletter</h2>
      <p className="text-sm text-slate-500">Subscribers list.</p>
      <div className="mt-6">
        <DataTable
          rows={rows}
          columns={[
            { key: 'email', header: 'Email', render: (r) => r.email },
            { key: 'status', header: 'Status', render: (r) => r.status },
            {
              key: 'created',
              header: 'Joined',
              render: (r) => new Date(r.createdAt).toLocaleDateString(),
            },
            {
              key: 'actions',
              header: '',
              render: (r) => (
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => {
                    void mutate(`/admin/newsletter/${r.id}`, 'DELETE').then(() => {
                      push('Removed');
                      void load();
                    });
                  }}
                >
                  Remove
                </button>
              ),
            },
          ]}
        />
      </div>
    </PermissionGate>
  );
}
