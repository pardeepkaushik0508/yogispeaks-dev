'use client';

import { AdminCrudPage } from '@/components/admin/AdminCrudPage';

export default function TestimonialsAdminPage() {
  return (
    <AdminCrudPage
      title="Testimonials"
      permission="testimonials.manage"
      endpoint="/admin/testimonials"
      fields={[
        { name: 'studentName', label: 'Student name', required: true },
        { name: 'designation', label: 'Designation', required: true },
        { name: 'review', label: 'Review', type: 'textarea', required: true },
        { name: 'rating', label: 'Rating (1-5)', type: 'number' },
        { name: 'courseLabel', label: 'Course label' },
      ]}
      transformCreate={(form) => ({
        ...form,
        rating: Number(form.rating || 5),
        isVisible: true,
      })}
      columns={[
        { key: 'name', header: 'Name', render: (r) => String(r.studentName) },
        { key: 'rating', header: 'Rating', render: (r) => String(r.rating) },
        {
          key: 'review',
          header: 'Review',
          render: (r) => (
            <span className="line-clamp-2 max-w-xs text-slate-600">
              {String(r.review)}
            </span>
          ),
        },
      ]}
    />
  );
}
