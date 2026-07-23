'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';
import { getAccessToken } from '@/lib/admin-auth';
import { publicEnv } from '@/lib/env';

type Inquiry = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  type: string;
  createdAt: string;
};

export default function InquiriesAdminPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<Inquiry[]>([]);

  const load = useCallback(async () => {
    try {
      setRows(await get<Inquiry[]>('/admin/inquiries'));
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PermissionGate
      permission="inquiries.manage"
      fallback={<p className="text-sm text-red-600">You do not have access.</p>}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inquiries</h2>
          <p className="text-sm text-slate-500">Leads and assessment requests.</p>
        </div>
        <a
          className="rounded-md border px-3 py-2 text-sm"
          href={`${publicEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/admin/inquiries/export`}
          onClick={(e) => {
            e.preventDefault();
            void fetch(
              `${publicEnv.NEXT_PUBLIC_API_URL.replace(/\/$/, '')}/admin/inquiries/export`,
              {
                headers: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
                credentials: 'include',
              },
            ).then(async (res) => {
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'inquiries.csv';
              a.click();
            });
          }}
        >
          Export CSV
        </a>
      </div>
      <div className="mt-6">
        <DataTable
          rows={rows}
          columns={[
            { key: 'name', header: 'Name', render: (r) => r.fullName },
            { key: 'email', header: 'Email', render: (r) => r.email },
            { key: 'type', header: 'Type', render: (r) => r.type },
            {
              key: 'status',
              header: 'Status',
              render: (r) => (
                <select
                  className="rounded border px-2 py-1 text-xs"
                  value={r.status}
                  onChange={(e) => {
                    void mutate(`/admin/inquiries/${r.id}/status`, 'PATCH', {
                      status: e.target.value,
                    }).then(() => {
                      push('Status updated');
                      void load();
                    });
                  }}
                >
                  {['NEW', 'CONTACTED', 'QUALIFIED', 'ENROLLED', 'CLOSED', 'SPAM'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ),
                  )}
                </select>
              ),
            },
            {
              key: 'created',
              header: 'Created',
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
          ]}
        />
      </div>
    </PermissionGate>
  );
}
