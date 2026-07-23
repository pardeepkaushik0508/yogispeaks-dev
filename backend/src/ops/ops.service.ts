import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeRichTextHtml } from '../common/utils/sanitize-html.util';

@Injectable()
export class OpsService {
  constructor(private readonly prisma: PrismaService) {}

  listInquiries() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        interestedCourse: true,
        notes: {
          orderBy: { createdAt: 'desc' },
          include: {
            adminUser: { select: { fullName: true, email: true } },
          },
        },
      },
    });
  }

  async getInquiry(id: string) {
    const row = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        interestedCourse: true,
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { adminUser: { select: { fullName: true } } },
        },
      },
    });
    if (!row) throw new NotFoundException('Inquiry not found');
    return row;
  }

  async updateInquiryStatus(id: string, status: InquiryStatus) {
    await this.getInquiry(id);
    return this.prisma.inquiry.update({ where: { id }, data: { status } });
  }

  async addInquiryNote(id: string, body: string, adminUserId: string) {
    await this.getInquiry(id);
    return this.prisma.inquiryNote.create({
      data: { inquiryId: id, body, adminUserId },
    });
  }

  async exportInquiriesCsv() {
    const rows = await this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const header = 'id,type,status,fullName,email,mobile,createdAt';
    const lines = rows.map((r) =>
      [
        r.id,
        r.type,
        r.status,
        JSON.stringify(r.fullName),
        r.email,
        r.mobile || '',
        r.createdAt.toISOString(),
      ].join(','),
    );
    return [header, ...lines].join('\n');
  }

  listSubscribers() {
    return this.prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async exportSubscribersCsv() {
    const rows = await this.listSubscribers();
    const header = 'id,email,status,createdAt';
    const lines = rows.map((r) =>
      [r.id, r.email, r.status, r.createdAt.toISOString()].join(','),
    );
    return [header, ...lines].join('\n');
  }

  async removeSubscriber(id: string) {
    return this.prisma.newsletterSubscriber.delete({ where: { id } });
  }

  listEmailTemplates() {
    return this.prisma.emailTemplate.findMany({ orderBy: { key: 'asc' } });
  }

  async getEmailTemplate(id: string) {
    const row = await this.prisma.emailTemplate.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Template not found');
    return row;
  }

  async updateEmailTemplate(id: string, dto: Record<string, unknown>) {
    await this.getEmailTemplate(id);
    const bodyHtml =
      typeof dto.bodyHtml === 'string'
        ? sanitizeRichTextHtml(dto.bodyHtml)
        : undefined;
    return this.prisma.emailTemplate.update({
      where: { id },
      data: {
        ...(typeof dto.subject === 'string' ? { subject: dto.subject } : {}),
        ...(typeof dto.description === 'string'
          ? { description: dto.description }
          : {}),
        ...(bodyHtml !== undefined ? { bodyHtml } : {}),
      },
    });
  }

  async listAuditLogs(page = 1, pageSize = 50) {
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { actor: { select: { email: true, fullName: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);
    return { items, total, page, pageSize };
  }

  async dashboardStats() {
    const [
      courses,
      blogs,
      inquiries,
      subscribers,
      faqs,
      testimonials,
      media,
    ] = await Promise.all([
      this.prisma.course.count({ where: { deletedAt: null } }),
      this.prisma.blogPost.count({ where: { deletedAt: null } }),
      this.prisma.inquiry.count(),
      this.prisma.newsletterSubscriber.count(),
      this.prisma.faq.count({ where: { deletedAt: null } }),
      this.prisma.testimonial.count({ where: { deletedAt: null } }),
      this.prisma.mediaAsset.count({ where: { deletedAt: null } }),
    ]);
    const recentInquiries = await this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        type: true,
        createdAt: true,
      },
    });
    return {
      counts: {
        courses,
        blogs,
        inquiries,
        subscribers,
        faqs,
        testimonials,
        media,
      },
      recentInquiries,
    };
  }
}
