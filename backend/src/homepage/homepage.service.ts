import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeRichTextHtml } from '../common/utils/sanitize-html.util';

@Injectable()
export class HomepageService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminBundle() {
    const [sections, stats, features, steps, benefits] = await Promise.all([
      this.prisma.homepageSection.findMany({ orderBy: { sortOrder: 'asc' }, include: { media: true } }),
      this.prisma.homepageStat.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.feature.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.learningStep.findMany({ orderBy: { sortOrder: 'asc' } }),
      this.prisma.benefitItem.findMany({ orderBy: { sortOrder: 'asc' } }),
    ]);
    return { sections, stats, features, steps, benefits };
  }

  async getPublicBundle() {
    const [sections, stats, features, steps, benefits, faqs, courses, testimonials] = await Promise.all([
      this.prisma.homepageSection.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' }, include: { media: true } }),
      this.prisma.homepageStat.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.feature.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.learningStep.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.benefitItem.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.faq.findMany({ where: { deletedAt: null, isVisible: true, showOnHomepage: true }, orderBy: { sortOrder: 'asc' } }),
      this.prisma.course.findMany({ where: { deletedAt: null, status: 'PUBLISHED', isFeatured: true }, orderBy: { sortOrder: 'asc' }, include: { featuredImage: true } }),
      this.prisma.testimonial.findMany({ where: { deletedAt: null, isVisible: true }, orderBy: { sortOrder: 'asc' }, take: 12, include: { studentImage: true } }),
    ]);
    return { sections, stats, features, steps, benefits, faqs, courses, testimonials };
  }

  updateSection(id: string, dto: any) {
    return this.prisma.homepageSection.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.bodyHtml !== undefined ? { bodyHtml: sanitizeRichTextHtml(dto.bodyHtml || '') } : {}),
      },
    });
  }

  createStat(dto: any) { return this.prisma.homepageStat.create({ data: dto }); }
  updateStat(id: string, dto: any) { return this.prisma.homepageStat.update({ where: { id }, data: dto }); }
  deleteStat(id: string) { return this.prisma.homepageStat.delete({ where: { id } }); }

  createFeature(dto: any) { return this.prisma.feature.create({ data: dto }); }
  updateFeature(id: string, dto: any) { return this.prisma.feature.update({ where: { id }, data: dto }); }
  deleteFeature(id: string) { return this.prisma.feature.delete({ where: { id } }); }

  createStep(dto: any) { return this.prisma.learningStep.create({ data: dto }); }
  updateStep(id: string, dto: any) { return this.prisma.learningStep.update({ where: { id }, data: dto }); }
  deleteStep(id: string) { return this.prisma.learningStep.delete({ where: { id } }); }

  createBenefit(dto: any) { return this.prisma.benefitItem.create({ data: dto }); }
  updateBenefit(id: string, dto: any) { return this.prisma.benefitItem.update({ where: { id }, data: dto }); }
  deleteBenefit(id: string) { return this.prisma.benefitItem.delete({ where: { id } }); }

  async reorder(table: 'homepageStat' | 'feature' | 'learningStep' | 'benefitItem' | 'homepageSection', ids: string[]) {
    const model = this.prisma[table] as any;
    await this.prisma.$transaction(ids.map((id, i) => model.update({ where: { id }, data: { sortOrder: i } })));
    return { ok: true };
  }
}
