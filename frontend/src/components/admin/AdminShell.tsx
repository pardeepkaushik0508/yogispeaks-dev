'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';
import { hasPermission } from '@/lib/admin-auth';
import { ADMIN_NAV } from '@/lib/admin-nav';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { PageLoader } from '@/components/ui/Spinner';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/cn';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [accountOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-100 text-slate-900">
        <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex-1 space-y-2 px-3 py-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
          <div className="border-t border-slate-200 p-3 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 items-center border-b border-slate-200 bg-white px-6">
            <Skeleton className="h-4 w-40" />
          </div>
          <PageLoader className="flex-1" label="Loading admin…" />
        </div>
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
        <div ref={accountRef} className="relative border-t border-slate-200 p-3">
          {accountOpen ? (
            <div
              role="menu"
              className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg"
            >
              <Link
                href="/admin/profile"
                role="menuitem"
                className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setAccountOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/admin/change-password"
                role="menuitem"
                className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setAccountOpen(false)}
              >
                Change password
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setAccountOpen(false);
                  void logout();
                }}
                className="block w-full px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          ) : null}
          <button
            type="button"
            className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-slate-50"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            onClick={() => setAccountOpen((v) => !v)}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-slate-900">
                {user.fullName}
              </span>
              <span className="block truncate text-xs text-slate-500">
                {user.email}
              </span>
            </span>
            <ChevronUp
              className={cn(
                'mt-0.5 size-4 shrink-0 text-slate-400 transition-transform',
                accountOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </button>
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
