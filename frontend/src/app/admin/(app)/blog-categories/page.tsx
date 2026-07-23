'use client';

import { AdminCrudPage } from '@/components/admin/AdminCrudPage';

export default function BlogCategoriesPage() {
  return (
    <AdminCrudPage
      title="Blog categories"
      permission="blogs.manage"
      endpoint="/admin/blog-categories"
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'slug', label: 'Slug' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ]}
      columns={[
        { key: 'name', header: 'Name', render: (r) => String(r.name) },
        { key: 'slug', header: 'Slug', render: (r) => String(r.slug) },
      ]}
    />
  );
}
