'use client';

import { hasPermission } from '@/lib/admin-auth';
import { useAdminAuth } from '@/components/admin/AdminAuthProvider';
import { PageLoader } from '@/components/ui/Spinner';

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
  if (loading) return <PageLoader className="min-h-[8rem]" />;
  if (!hasPermission(user, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
