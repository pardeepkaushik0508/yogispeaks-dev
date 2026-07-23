'use client';

import { AdminCrudPage } from '@/components/admin/AdminCrudPage';

export default function CoursesAdminPage() {
  return (
    <AdminCrudPage
      title="Courses"
      permission="courses.manage"
      endpoint="/admin/courses"
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'slug', label: 'Slug' },
        { name: 'shortDescription', label: 'Short description', type: 'textarea' },
        { name: 'longDescriptionHtml', label: 'Long description HTML', type: 'textarea' },
        { name: 'duration', label: 'Duration' },
        { name: 'mode', label: 'Mode' },
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
        { key: 'name', header: 'Name', render: (r) => String(r.name) },
        { key: 'slug', header: 'Slug', render: (r) => String(r.slug) },
        { key: 'status', header: 'Status', render: (r) => String(r.status) },
        {
          key: 'featured',
          header: 'Featured',
          render: (r) => (r.isFeatured ? 'Yes' : 'No'),
        },
      ]}
    />
  );
}
