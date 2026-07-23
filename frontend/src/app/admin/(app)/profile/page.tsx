'use client';

import { useAdminAuth } from '@/components/admin/AdminAuthProvider';

export default function AdminProfilePage() {
  const { user } = useAdminAuth();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
      <p className="mt-1 text-sm text-slate-500">Your admin account details.</p>
      <dl className="mt-6 space-y-4 rounded-md border border-slate-200 bg-white p-6">
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-500">Name</dt>
          <dd className="mt-1 text-sm text-slate-900">{user.fullName}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-500">Email</dt>
          <dd className="mt-1 text-sm text-slate-900">{user.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-500">Roles</dt>
          <dd className="mt-1 text-sm text-slate-900">{user.roles.join(', ')}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase text-slate-500">
            Permissions
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1">
            {user.permissions.map((p) => (
              <span
                key={p}
                className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
              >
                {p}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
