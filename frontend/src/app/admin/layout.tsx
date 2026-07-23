'use client';

import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider';
import { ToastProvider } from '@/components/admin/Toast';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AdminAuthProvider>
  );
}
