export type AdminNavItem = {
  label: string;
  href: string;
  permission?: string;
};

/** Sidebar links for the admin CMS. Filtered by permission at runtime. */
export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', permission: 'dashboard.read' },
  { label: 'Homepage', href: '/admin/homepage', permission: 'homepage.manage' },
  { label: 'Pages', href: '/admin/pages', permission: 'pages.manage' },
  { label: 'Courses', href: '/admin/courses', permission: 'courses.manage' },
  { label: 'Testimonials', href: '/admin/testimonials', permission: 'testimonials.manage' },
  { label: 'FAQs', href: '/admin/faqs', permission: 'faqs.manage' },
  { label: 'Blog posts', href: '/admin/blogs', permission: 'blogs.manage' },
  { label: 'Blog categories', href: '/admin/blog-categories', permission: 'blogs.manage' },
  { label: 'Media', href: '/admin/media', permission: 'media.manage' },
  { label: 'Inquiries', href: '/admin/inquiries', permission: 'inquiries.manage' },
  { label: 'Newsletter', href: '/admin/newsletter', permission: 'newsletter.manage' },
  { label: 'Email templates', href: '/admin/email-templates', permission: 'email_templates.manage' },
  { label: 'Site settings', href: '/admin/site-settings', permission: 'settings.manage' },
  { label: 'Navigation', href: '/admin/navigation', permission: 'navigation.manage' },
  { label: 'Users', href: '/admin/users', permission: 'users.manage' },
  { label: 'Audit logs', href: '/admin/audit-logs', permission: 'audit.read' },
];
