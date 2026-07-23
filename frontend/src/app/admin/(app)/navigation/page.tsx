'use client';

import { AdminCrudPage } from '@/components/admin/AdminCrudPage';

export default function NavigationAdminPage() {
  return (
    <AdminCrudPage
      title="Navigation"
      permission="navigation.manage"
      endpoint="/admin/navigation"
      fields={[
        { name: 'label', label: 'Label', required: true },
        { name: 'href', label: 'Href', required: true },
        {
          name: 'location',
          label: 'Location',
          type: 'select',
          options: [
            { value: 'HEADER', label: 'Header' },
            { value: 'FOOTER_QUICK', label: 'Footer quick links' },
            { value: 'FOOTER_PROGRAMS', label: 'Footer programs' },
          ],
        },
      ]}
      columns={[
        { key: 'label', header: 'Label', render: (r) => String(r.label) },
        { key: 'href', header: 'Href', render: (r) => String(r.href) },
        {
          key: 'location',
          header: 'Location',
          render: (r) => String(r.location),
        },
      ]}
    />
  );
}
