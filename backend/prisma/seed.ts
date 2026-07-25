/**
 * Database seed for YogiSpeaks.
 * Creates roles, permissions, and the super-admin from environment variables.
 * Never hard-code production passwords in source.
 */
import 'dotenv/config';
import * as argon2 from 'argon2';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, RoleCode } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seeding');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const ALL_PERMISSIONS = [
  { code: 'dashboard.read', name: 'View dashboard' },
  { code: 'users.manage', name: 'Manage admin users' },
  { code: 'roles.manage', name: 'Manage roles' },
  { code: 'settings.manage', name: 'Manage site settings' },
  { code: 'navigation.manage', name: 'Manage navigation' },
  { code: 'homepage.manage', name: 'Manage homepage' },
  { code: 'pages.manage', name: 'Manage pages' },
  { code: 'courses.manage', name: 'Manage courses' },
  { code: 'testimonials.manage', name: 'Manage testimonials' },
  { code: 'faqs.manage', name: 'Manage FAQs' },
  { code: 'blogs.manage', name: 'Manage blogs' },
  { code: 'media.manage', name: 'Manage media' },
  { code: 'inquiries.manage', name: 'Manage inquiries' },
  { code: 'newsletter.manage', name: 'Manage newsletter' },
  { code: 'email_templates.manage', name: 'Manage email templates' },
  { code: 'audit.read', name: 'View audit logs' },
] as const;

const ADMIN_EXCLUDED = new Set([
  'users.manage',
  'roles.manage',
  'audit.read',
]);

const EDITOR_PERMISSIONS = new Set([
  'dashboard.read',
  'homepage.manage',
  'pages.manage',
  'courses.manage',
  'testimonials.manage',
  'faqs.manage',
  'blogs.manage',
  'media.manage',
]);

export async function main(): Promise<void> {
  await prisma.$executeRawUnsafe(
    'CREATE EXTENSION IF NOT EXISTS "citext"',
  );

  for (const permission of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: permission.code },
      update: { name: permission.name },
      create: {
        code: permission.code,
        name: permission.name,
      },
    });
  }

  const roles = [
    {
      code: RoleCode.SUPER_ADMIN,
      name: 'Super Admin',
      description: 'Full access including users and audit logs',
    },
    {
      code: RoleCode.ADMIN,
      name: 'Admin',
      description: 'Manage website content and enquiries',
    },
    {
      code: RoleCode.EDITOR,
      name: 'Editor',
      description: 'Manage pages, courses, blogs, FAQs and testimonials',
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: { name: role.name, description: role.description },
      create: role,
    });
  }

  const permissions = await prisma.permission.findMany();
  const roleRows = await prisma.role.findMany();

  for (const role of roleRows) {
    let allowed = permissions;
    if (role.code === RoleCode.ADMIN) {
      allowed = permissions.filter((p) => !ADMIN_EXCLUDED.has(p.code));
    } else if (role.code === RoleCode.EDITOR) {
      allowed = permissions.filter((p) => EDITOR_PERMISSIONS.has(p.code));
    }

    for (const permission of allowed) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set to seed the admin user',
    );
  }

  const passwordHash = await argon2.hash(password);
  const superRole = roleRows.find((r) => r.code === RoleCode.SUPER_ADMIN);
  if (!superRole) {
    throw new Error('SUPER_ADMIN role missing after seed');
  }

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      fullName: 'YogiSpeaks Super Admin',
      status: 'ACTIVE',
      deletedAt: null,
    },
    create: {
      email,
      passwordHash,
      fullName: 'YogiSpeaks Super Admin',
      status: 'ACTIVE',
    },
  });

  await prisma.adminUserRole.upsert({
    where: {
      adminUserId_roleId: {
        adminUserId: admin.id,
        roleId: superRole.id,
      },
    },
    update: {},
    create: {
      adminUserId: admin.id,
      roleId: superRole.id,
    },
  });

  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        businessName: 'YogiSpeaks',
        tagline: 'Confidence to Communicate',
        brandPrimary: '#0a192f',
        brandPrimaryDark: '#050a18',
        brandAccent: '#c49b48',
        brandBackground: '#ffffff',
        brandSurface: '#f9f9f9',
        brandText: '#111827',
        brandMuted: '#6b7280',
        headerCtaLabel: 'BOOK FREE ASSESSMENT',
        headerCtaHref: '/free-assessment',
        headerCtaIsVisible: true,
      },
    });
  }

  const { seedMarketingContent } = await import('./seed-marketing-content');
  await seedMarketingContent(prisma);
  console.log('Marketing content seeded (About + Spoken English + IELTS).');

  const { seedMarketingPages } = await import('./seed-marketing-pages');
  await seedMarketingPages(prisma);
  console.log('Marketing pages seeded (Reviews, Blog, Contact, FAQ, legal).');

  console.log(`Seed complete. Super admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
