'use client';

import { hasPermission } from '@/lib/admin-auth';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user, loading } = useAdminAuth();
  if (loading) return null;
  if (!hasPermission(user, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
