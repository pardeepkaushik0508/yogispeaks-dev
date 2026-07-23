'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { hasPermission } from '@/lib/admin-auth';
import { ADMIN_NAV } from '@/lib/admin-nav';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { cn } from '@/lib/cn';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Loading admin…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const links = ADMIN_NAV.filter(
    (item) => !item.permission || hasPermission(user, item.permission),
  );

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            YogiSpeaks
          </p>
          <p className="text-sm font-bold text-slate-900">Admin CMS</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Admin">
          <ul className="space-y-0.5">
            {links.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-slate-200 p-3 text-sm">
          <p className="truncate font-medium">{user.fullName}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <div className="mt-2 flex flex-col gap-1">
            <Link
              href="/admin/profile"
              className="text-xs text-slate-600 underline-offset-2 hover:underline"
            >
              Profile
            </Link>
            <Link
              href="/admin/change-password"
              className="text-xs text-slate-600 underline-offset-2 hover:underline"
            >
              Change password
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-left text-xs font-medium text-red-600 hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-sm font-semibold text-slate-700">
            Content management
          </h1>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 underline-offset-2 hover:underline"
          >
            View site
          </a>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
