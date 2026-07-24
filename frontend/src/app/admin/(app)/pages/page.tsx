'use client';

import { AdminCrudPage } from '@/components/admin/AdminCrudPage';

export default function PagesAdminPage() {
  return (
    <AdminCrudPage
      title="Pages"
      permission="pages.manage"
      endpoint="/admin/pages"
      editHref={(row) => `/admin/pages/${row.id}`}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'slug', label: 'Slug' },
        { name: 'bodyHtml', label: 'Body HTML', type: 'textarea' },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PUBLISHED', label: 'Published' },
          ],
        },
      ]}
      columns={[
        { key: 'title', header: 'Title', render: (r) => String(r.title) },
        { key: 'slug', header: 'Slug', render: (r) => String(r.slug) },
        { key: 'status', header: 'Status', render: (r) => String(r.status) },
      ]}
    />
  );
}
