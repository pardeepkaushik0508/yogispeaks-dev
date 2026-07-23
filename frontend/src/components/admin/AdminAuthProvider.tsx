'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api-client';
import {
  type AdminUser,
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/lib/admin-auth';

type AuthContextValue = {
  user: AdminUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_ADMIN_PATHS = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
];

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await apiFetch<AdminUser>('/auth/me', { accessToken: token });
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        try {
          const refreshed = await apiFetch<{ accessToken: string }>(
            '/auth/refresh',
            { method: 'POST' },
          );
          setAccessToken(refreshed.accessToken);
          const me = await apiFetch<AdminUser>('/auth/me', {
            accessToken: refreshed.accessToken,
          });
          setUser(me);
          return;
        } catch {
          clearAccessToken();
          setUser(null);
          return;
        }
      }
      clearAccessToken();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await refreshUser();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p));
    if (!user && !isPublic) {
      router.replace('/admin/login');
    }
    if (user && (pathname === '/admin/login' || pathname === '/admin')) {
      router.replace('/admin/dashboard');
    }
  }, [loading, user, pathname, router]);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    clearAccessToken();
    setUser(null);
    router.replace('/admin/login');
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, refreshUser, logout }),
    [user, loading, refreshUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAdminAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
