'use client';

import { AdminCrudPage } from '@/components/admin/AdminCrudPage';

export default function FaqsAdminPage() {
  return (
    <AdminCrudPage
      title="FAQs"
      permission="faqs.manage"
      endpoint="/admin/faqs"
      fields={[
        { name: 'question', label: 'Question', required: true },
        { name: 'answerHtml', label: 'Answer HTML', type: 'textarea' },
        { name: 'category', label: 'Category' },
      ]}
      transformCreate={(form) => ({
        ...form,
        showOnHomepage: true,
        isVisible: true,
      })}
      columns={[
        { key: 'question', header: 'Question', render: (r) => String(r.question) },
        {
          key: 'home',
          header: 'Homepage',
          render: (r) => (r.showOnHomepage ? 'Yes' : 'No'),
        },
      ]}
    />
  );
}
