import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PublishStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeRichTextHtml } from '../common/utils/sanitize-html.util';
import { slugify } from '../common/utils/slug.util';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  // Pages
  listPages() {
    return this.prisma.page.findMany({ where: { deletedAt: null }, orderBy: { updatedAt: 'desc' } });
  }
  async getPage(id: string) {
    const row = await this.prisma.page.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('Page not found');
    return row;
  }
  async getPageBySlug(slug: string) {
    const row = await this.prisma.page.findFirst({ where: { slug, deletedAt: null, status: PublishStatus.PUBLISHED } });
    if (!row) throw new NotFoundException('Page not found');
    return row;
  }
  createPage(dto: any) {
    return this.prisma.page.create({
      data: {
        title: dto.title,
        slug: dto.slug || slugify(dto.title),
        bodyHtml: sanitizeRichTextHtml(dto.bodyHtml || ''),
        status: dto.status || PublishStatus.DRAFT,
        heroImageId: dto.heroImageId,
        metaTitle: dto.metaTitle,
        metaDescription: dto.metaDescription,
      },
    });
  }
  async updatePage(id: string, dto: any) {
    await this.getPage(id);
    return this.prisma.page.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.bodyHtml !== undefined ? { bodyHtml: sanitizeRichTextHtml(dto.bodyHtml) } : {}),
        ...(dto.slug ? { slug: slugify(dto.slug) } : {}),
      },
    });
  }
  async deletePage(id: string) {
    await this.getPage(id);
    return this.prisma.page.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // Courses
  listCourses(admin = true) {
    return this.prisma.course.findMany({
      where: { deletedAt: null, ...(admin ? {} : { status: PublishStatus.PUBLISHED }) },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { benefits: { orderBy: { sortOrder: 'asc' } }, featuredImage: true },
    });
  }
  async getCourse(id: string) {
    const row = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      include: { benefits: { orderBy: { sortOrder: 'asc' } }, curriculumItems: { orderBy: { sortOrder: 'asc' } }, galleryItems: true, featuredImage: true },
    });
    if (!row) throw new NotFoundException('Course not found');
    return row;
  }
  async getCourseBySlug(slug: string) {
    const row = await this.prisma.course.findFirst({
      where: { slug, deletedAt: null, status: PublishStatus.PUBLISHED },
      include: { benefits: { orderBy: { sortOrder: 'asc' } }, curriculumItems: { orderBy: { sortOrder: 'asc' } }, featuredImage: true },
    });
    if (!row) throw new NotFoundException('Course not found');
    return row;
  }
  async createCourse(dto: any) {
    const { benefits, ...rest } = dto;
    return this.prisma.course.create({
      data: {
        name: rest.name,
        slug: rest.slug || slugify(rest.name),
        shortDescription: rest.shortDescription || '',
        longDescriptionHtml: sanitizeRichTextHtml(rest.longDescriptionHtml || ''),
        duration: rest.duration || '',
        mode: rest.mode || 'Online',
        status: rest.status || PublishStatus.DRAFT,
        isFeatured: rest.isFeatured ?? false,
        sortOrder: rest.sortOrder ?? 0,
        featuredImageId: rest.featuredImageId,
        eligibilityHtml: rest.eligibilityHtml ? sanitizeRichTextHtml(rest.eligibilityHtml) : null,
        whoShouldJoinHtml: rest.whoShouldJoinHtml ? sanitizeRichTextHtml(rest.whoShouldJoinHtml) : null,
        ctaLabel: rest.ctaLabel,
        ctaHref: rest.ctaHref,
        benefits: Array.isArray(benefits)
          ? { create: benefits.map((b: any, i: number) => ({ label: b.label || b, sortOrder: i })) }
          : undefined,
      },
      include: { benefits: true },
    });
  }
  async updateCourse(id: string, dto: any) {
    await this.getCourse(id);
    const { benefits, ...rest } = dto;
    if (Array.isArray(benefits)) {
      await this.prisma.courseBenefit.deleteMany({ where: { courseId: id } });
      await this.prisma.courseBenefit.createMany({
        data: benefits.map((b: any, i: number) => ({ courseId: id, label: b.label || b, sortOrder: i })),
      });
    }
    return this.prisma.course.update({
      where: { id },
      data: {
        ...rest,
        ...(rest.longDescriptionHtml !== undefined ? { longDescriptionHtml: sanitizeRichTextHtml(rest.longDescriptionHtml) } : {}),
        ...(rest.eligibilityHtml !== undefined ? { eligibilityHtml: sanitizeRichTextHtml(rest.eligibilityHtml || '') } : {}),
        ...(rest.whoShouldJoinHtml !== undefined ? { whoShouldJoinHtml: sanitizeRichTextHtml(rest.whoShouldJoinHtml || '') } : {}),
        ...(rest.slug ? { slug: slugify(rest.slug) } : {}),
        ...(rest.name && !rest.slug ? {} : {}),
      },
      include: { benefits: { orderBy: { sortOrder: 'asc' } } },
    });
  }
  async deleteCourse(id: string) {
    await this.getCourse(id);
    return this.prisma.course.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  async reorderCourses(ids: string[]) {
    await this.prisma.$transaction(ids.map((id, i) => this.prisma.course.update({ where: { id }, data: { sortOrder: i } })));
    return { ok: true };
  }

  // FAQs
  listFaqs(admin = true) {
    return this.prisma.faq.findMany({
      where: { deletedAt: null, ...(admin ? {} : { isVisible: true }) },
      orderBy: { sortOrder: 'asc' },
    });
  }
  async createFaq(dto: any) {
    return this.prisma.faq.create({
      data: {
        question: dto.question,
        answerHtml: sanitizeRichTextHtml(dto.answerHtml || ''),
        category: dto.category,
        showOnHomepage: dto.showOnHomepage ?? false,
        isVisible: dto.isVisible ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }
  async updateFaq(id: string, dto: any) {
    const row = await this.prisma.faq.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('FAQ not found');
    return this.prisma.faq.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.answerHtml !== undefined ? { answerHtml: sanitizeRichTextHtml(dto.answerHtml) } : {}),
      },
    });
  }
  async deleteFaq(id: string) {
    const row = await this.prisma.faq.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('FAQ not found');
    return this.prisma.faq.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  async reorderFaqs(ids: string[]) {
    await this.prisma.$transaction(ids.map((id, i) => this.prisma.faq.update({ where: { id }, data: { sortOrder: i } })));
    return { ok: true };
  }

  // Testimonials
  listTestimonials(admin = true) {
    return this.prisma.testimonial.findMany({
      where: { deletedAt: null, ...(admin ? {} : { isVisible: true }) },
      orderBy: { sortOrder: 'asc' },
      include: { studentImage: true },
    });
  }
  async createTestimonial(dto: any) {
    return this.prisma.testimonial.create({
      data: {
        studentName: dto.studentName,
        designation: dto.designation,
        review: dto.review,
        rating: dto.rating ?? 5,
        courseLabel: dto.courseLabel,
        isGoogleReview: dto.isGoogleReview ?? false,
        reviewUrl: dto.reviewUrl,
        studentImageId: dto.studentImageId,
        isVisible: dto.isVisible ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }
  async updateTestimonial(id: string, dto: any) {
    const row = await this.prisma.testimonial.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('Testimonial not found');
    return this.prisma.testimonial.update({ where: { id }, data: dto });
  }
  async deleteTestimonial(id: string) {
    const row = await this.prisma.testimonial.findFirst({ where: { id, deletedAt: null } });
    if (!row) throw new NotFoundException('Testimonial not found');
    return this.prisma.testimonial.update({ where: { id }, data: { deletedAt: new Date() } });
  }
  async reorderTestimonials(ids: string[]) {
    await this.prisma.$transaction(ids.map((id, i) => this.prisma.testimonial.update({ where: { id }, data: { sortOrder: i } })));
    return { ok: true };
  }

  // Blog categories
  listBlogCategories() {
    return this.prisma.blogCategory.findMany({ orderBy: { sortOrder: 'asc' } });
  }
  createBlogCategory(dto: any) {
    return this.prisma.blogCategory.create({
      data: { name: dto.name, slug: dto.slug || slugify(dto.name), description: dto.description, sortOrder: dto.sortOrder ?? 0 },
    });
  }
  async updateBlogCategory(id: string, dto: any) {
    return this.prisma.blogCategory.update({
      where: { id },
      data: { ...dto, ...(dto.slug ? { slug: slugify(dto.slug) } : {}) },
    });
  }
  async deleteBlogCategory(id: string) {
    const count = await this.prisma.blogPost.count({ where: { categoryId: id, deletedAt: null } });
    if (count > 0) throw new BadRequestException('Category has posts');
    return this.prisma.blogCategory.delete({ where: { id } });
  }

  // Blog posts
  listBlogPosts(admin = true) {
    return this.prisma.blogPost.findMany({
      where: { deletedAt: null, ...(admin ? {} : { status: PublishStatus.PUBLISHED }) },
      orderBy: { updatedAt: 'desc' },
      include: { category: true, featuredImage: true },
    });
  }
  async getBlogPost(id: string) {
    const row = await this.prisma.blogPost.findFirst({ where: { id, deletedAt: null }, include: { category: true } });
    if (!row) throw new NotFoundException('Post not found');
    return row;
  }
  createBlogPost(dto: any) {
    return this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug: dto.slug || slugify(dto.title),
        excerpt: dto.excerpt || '',
        bodyHtml: sanitizeRichTextHtml(dto.bodyHtml || ''),
        categoryId: dto.categoryId,
        authorName: dto.authorName || 'YogiSpeaks',
        status: dto.status || PublishStatus.DRAFT,
        featuredImageId: dto.featuredImageId,
        publishedAt: dto.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });
  }
  async updateBlogPost(id: string, dto: any) {
    await this.getBlogPost(id);
    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.bodyHtml !== undefined ? { bodyHtml: sanitizeRichTextHtml(dto.bodyHtml) } : {}),
        ...(dto.slug ? { slug: slugify(dto.slug) } : {}),
        ...(dto.status === PublishStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
      },
    });
  }
  async deleteBlogPost(id: string) {
    await this.getBlogPost(id);
    return this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
