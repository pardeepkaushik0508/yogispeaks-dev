'use client';

import { useCallback, useEffect, useState } from 'react';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { DataTable } from '@/components/admin/DataTable';
import { useAdminApi } from '@/hooks/useAdminApi';
import { useToast } from '@/components/admin/Toast';
import { ApiError } from '@/lib/api-client';

type UserRow = {
  id: string;
  email: string;
  fullName: string;
  status: string;
  roles: { role: { code: string; name: string } }[];
};

type Role = { id: string; code: string; name: string };

export default function UsersAdminPage() {
  const { get, mutate } = useAdminApi();
  const { push } = useToast();
  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    password: '',
    roleId: '',
  });

  const load = useCallback(async () => {
    try {
      const [users, roleRows] = await Promise.all([
        get<UserRow[]>('/admin/users'),
        get<Role[]>('/admin/roles'),
      ]);
      setRows(users);
      setRoles(roleRows);
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Failed to load', 'error');
    }
  }, [get, push]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    try {
      await mutate('/admin/users', 'POST', {
        email: form.email,
        fullName: form.fullName,
        password: form.password,
        roleIds: form.roleId ? [form.roleId] : [],
      });
      push('User created');
      setOpen(false);
      setForm({ email: '', fullName: '', password: '', roleId: '' });
      await load();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Create failed', 'error');
    }
  }

  return (
    <PermissionGate
      permission="users.manage"
      fallback={<p className="text-sm text-red-600">SUPER_ADMIN only.</p>}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-sm text-slate-500">Admin accounts and roles.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Add user
        </button>
      </div>
      <div className="mt-6">
        <DataTable
          rows={rows}
          columns={[
            { key: 'name', header: 'Name', render: (r) => r.fullName },
            { key: 'email', header: 'Email', render: (r) => r.email },
            { key: 'status', header: 'Status', render: (r) => r.status },
            {
              key: 'roles',
              header: 'Roles',
              render: (r) => r.roles.map((x) => x.role.code).join(', '),
            },
          ]}
        />
      </div>
      {open ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="font-semibold">New admin user</h3>
            <div className="mt-4 space-y-3">
              {(
                [
                  ['fullName', 'Full name'],
                  ['email', 'Email'],
                  ['password', 'Password (min 12)'],
                ] as const
              ).map(([name, label]) => (
                <label key={name} className="block text-sm">
                  {label}
                  <input
                    type={name === 'password' ? 'password' : 'text'}
                    className="mt-1 w-full rounded-md border px-3 py-2"
                    value={form[name]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [name]: e.target.value }))
                    }
                  />
                </label>
              ))}
              <label className="block text-sm">
                Role
                <select
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  value={form.roleId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roleId: e.target.value }))
                  }
                >
                  <option value="">Select…</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-md border px-3 py-2 text-sm">
                Cancel
              </button>
              <button type="button" onClick={() => void create()} className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white">
                Create
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PermissionGate>
  );
}
