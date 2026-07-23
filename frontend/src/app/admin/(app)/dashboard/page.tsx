'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { ADMIN_NAV } from '@/lib/admin-nav';
import { hasPermission } from '@/lib/admin-auth';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { useAdminApi } from '@/hooks/useAdminApi';
import { ApiError } from '@/lib/api-client';

type Stats = {
  counts: Record<string, number>;
  recentInquiries: {
    id: string;
    fullName: string;
    email: string;
    status: string;
    type: string;
    createdAt: string;
  }[];
};

export default function AdminDashboardPage() {
  const { user } = useAdminAuth();
  const { get } = useAdminApi();
  const [stats, setStats] = useState<Stats | null>(null);

  const load = useCallback(async () => {
    try {
      setStats(await get<Stats>('/admin/dashboard/stats'));
    } catch (err) {
      if (!(err instanceof ApiError)) return;
    }
  }, [get]);

  useEffect(() => {
    void load();
  }, [load]);

  const quickLinks = ADMIN_NAV.filter(
    (item) =>
      item.href !== '/admin/dashboard' &&
      (!item.permission || hasPermission(user, item.permission)),
  ).slice(0, 8);

  const cards = [
    ['Courses', 'courses'],
    ['Inquiries', 'inquiries'],
    ['Blog posts', 'blogs'],
    ['Subscribers', 'subscribers'],
  ] as const;

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">
        Welcome{user ? `, ${user.fullName}` : ''}. Manage coaching site content
        from the sidebar.
      </p>

      <PermissionGate permission="dashboard.read">
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, key]) => (
            <div
              key={key}
              className="rounded-md border border-slate-200 bg-white p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {stats?.counts?.[key] ?? '—'}
              </p>
            </div>
          ))}
        </div>

        {stats?.recentInquiries?.length ? (
          <div className="mt-8 rounded-md border bg-white p-4">
            <h3 className="text-sm font-semibold">Recent inquiries</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {stats.recentInquiries.map((i) => (
                <li key={i.id} className="flex justify-between gap-2 border-b py-2 last:border-0">
                  <span>
                    {i.fullName} · {i.email}
                  </span>
                  <span className="text-slate-500">{i.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </PermissionGate>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-800">Quick links</h3>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:border-slate-400"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
