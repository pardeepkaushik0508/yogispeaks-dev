'use client';

import { useEffect, useState } from 'react';
import { AdminCrudPage } from '@/components/admin/AdminCrudPage';
import { useAdminApi } from '@/hooks/useAdminApi';

export default function BlogsAdminPage() {
  const { get } = useAdminApi();
  const [categories, setCategories] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    void get<{ id: string; name: string }[]>('/admin/blog-categories').then(
      (rows) =>
        setCategories(rows.map((c) => ({ value: c.id, label: c.name }))),
    );
  }, [get]);

  return (
    <AdminCrudPage
      title="Blog posts"
      permission="blogs.manage"
      endpoint="/admin/blogs"
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'slug', label: 'Slug' },
        { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { name: 'bodyHtml', label: 'Body HTML', type: 'textarea' },
        { name: 'authorName', label: 'Author' },
        {
          name: 'categoryId',
          label: 'Category',
          type: 'select',
          options: categories,
        },
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
        {
          key: 'category',
          header: 'Category',
          render: (r) =>
            String(
              (r.category as { name?: string } | undefined)?.name ?? '',
            ),
        },
        { key: 'status', header: 'Status', render: (r) => String(r.status) },
      ]}
    />
  );
}
