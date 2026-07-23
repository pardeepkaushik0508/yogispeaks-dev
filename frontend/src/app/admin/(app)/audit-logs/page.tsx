'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';

type Log = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  createdAt: string;
  actor?: { email?: string; fullName?: string } | null;
};

export default function AuditLogsPage() {
  const { get } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<Log[]>([]);

  const load = useCallback(async () => {
    try {
      const data = await get<{ items: Log[] }>('/admin/audit-logs');
      setRows(data.items);
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PermissionGate
      permission="audit.read"
      fallback={<p className="text-sm text-red-600">SUPER_ADMIN only.</p>}
    >
      <h2 className="text-2xl font-bold">Audit logs</h2>
      <p className="text-sm text-slate-500">Security and change history.</p>
      <div className="mt-6">
        <DataTable
          rows={rows}
          columns={[
            {
              key: 'when',
              header: 'When',
              render: (r) => new Date(r.createdAt).toLocaleString(),
            },
            {
              key: 'actor',
              header: 'Actor',
              render: (r) => r.actor?.email || 'system',
            },
            { key: 'action', header: 'Action', render: (r) => r.action },
            {
              key: 'entity',
              header: 'Entity',
              render: (r) => `${r.entityType}${r.entityId ? `:${r.entityId}` : ''}`,
            },
          ]}
        />
      </div>
    </PermissionGate>
  );
}
