import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PublishStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { sanitizeRichTextHtml } from '../common/utils/sanitize-html.util';
import { slugify } from '../common/utils/slug.util';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  private pageInclude = {
    blocks: { orderBy: { sortOrder: 'asc' as const } },
    heroImage: true,
  };

  private courseInclude = {
    benefits: { orderBy: { sortOrder: 'asc' as const } },
    features: { orderBy: { sortOrder: 'asc' as const } },
    learningSteps: { orderBy: { sortOrder: 'asc' as const } },
    curriculumItems: { orderBy: { sortOrder: 'asc' as const } },
    galleryItems: true,
    featuredImage: true,
    faqs: {
      where: { deletedAt: null, isVisible: true },
      orderBy: { sortOrder: 'asc' as const },
    },
  };

  // Pages
  listPages() {
    return this.prisma.page.findMany({
      where: { deletedAt: null },
      orderBy: { updatedAt: 'desc' },
      include: { blocks: { orderBy: { sortOrder: 'asc' } } },
    });
  }
  async getPage(id: string) {
    const row = await this.prisma.page.findFirst({
      where: { id, deletedAt: null },
      include: this.pageInclude,
    });
    if (!row) throw new NotFoundException('Page not found');
    return row;
  }
  async getPageBySlug(slug: string) {
    const row = await this.prisma.page.findFirst({
      where: { slug, deletedAt: null, status: PublishStatus.PUBLISHED },
      include: {
        blocks: { where: { isVisible: true }, orderBy: { sortOrder: 'asc' } },
        heroImage: true,
      },
    });
    if (!row) throw new NotFoundException('Page not found');
    return row;
  }
  createPage(dto: any) {
    const { blocks, ...rest } = dto;
    return this.prisma.page.create({
      data: {
        title: rest.title,
        slug: rest.slug || slugify(rest.title),
        bodyHtml: sanitizeRichTextHtml(rest.bodyHtml || ''),
        status: rest.status || PublishStatus.DRAFT,
        heroImageId: rest.heroImageId,
        metaTitle: rest.metaTitle,
        metaDescription: rest.metaDescription,
        canonicalUrl: rest.canonicalUrl,
        ogTitle: rest.ogTitle,
        ogDescription: rest.ogDescription,
        ogImageId: rest.ogImageId,
        blocks: Array.isArray(blocks)
          ? {
              create: blocks.map((b: any, i: number) => ({
                key: b.key,
                title: b.title,
                subtitle: b.subtitle,
                bodyHtml: b.bodyHtml ? sanitizeRichTextHtml(b.bodyHtml) : null,
                itemsJson: b.itemsJson ?? b.items ?? undefined,
                sortOrder: b.sortOrder ?? i,
                isVisible: b.isVisible ?? true,
              })),
            }
          : undefined,
      },
      include: this.pageInclude,
    });
  }
  async updatePage(id: string, dto: any) {
    await this.getPage(id);
    const { blocks, ...rest } = dto;
    if (Array.isArray(blocks)) {
      await this.prisma.pageBlock.deleteMany({ where: { pageId: id } });
      await this.prisma.pageBlock.createMany({
        data: blocks.map((b: any, i: number) => ({
          pageId: id,
          key: b.key,
          title: b.title ?? null,
          subtitle: b.subtitle ?? null,
          bodyHtml: b.bodyHtml ? sanitizeRichTextHtml(b.bodyHtml) : null,
          itemsJson: b.itemsJson ?? b.items ?? Prisma.JsonNull,
          sortOrder: b.sortOrder ?? i,
          isVisible: b.isVisible ?? true,
        })),
      });
    }
    const {
      id: _id,
      createdAt: _c,
      updatedAt: _u,
      deletedAt: _d,
      blocks: _b,
      heroImage: _h,
      ogImage: _o,
      ...safe
    } = rest;
    return this.prisma.page.update({
      where: { id },
      data: {
        ...safe,
        ...(rest.bodyHtml !== undefined ? { bodyHtml: sanitizeRichTextHtml(rest.bodyHtml) } : {}),
        ...(rest.slug ? { slug: slugify(rest.slug) } : {}),
      },
      include: this.pageInclude,
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
      include: {
        benefits: { orderBy: { sortOrder: 'asc' } },
        features: { orderBy: { sortOrder: 'asc' } },
        featuredImage: true,
      },
    });
  }
  async getCourse(id: string) {
    const row = await this.prisma.course.findFirst({
      where: { id, deletedAt: null },
      include: {
        ...this.courseInclude,
        faqs: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!row) throw new NotFoundException('Course not found');
    return row;
  }
  async getCourseBySlug(slug: string) {
    const row = await this.prisma.course.findFirst({
      where: { slug, deletedAt: null, status: PublishStatus.PUBLISHED },
      include: this.courseInclude,
    });
    if (!row) throw new NotFoundException('Course not found');
    return row;
  }
  async createCourse(dto: any) {
    const { benefits, features, learningSteps, curriculumItems, faqs, ...rest } = dto;
    const course = await this.prisma.course.create({
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
        whyLearnHtml: rest.whyLearnHtml ? sanitizeRichTextHtml(rest.whyLearnHtml) : null,
        whyChooseHtml: rest.whyChooseHtml ? sanitizeRichTextHtml(rest.whyChooseHtml) : null,
        heroHeadline: rest.heroHeadline,
        secondaryCtaLabel: rest.secondaryCtaLabel,
        secondaryCtaHref: rest.secondaryCtaHref,
        ctaLabel: rest.ctaLabel,
        ctaHref: rest.ctaHref,
        metaTitle: rest.metaTitle,
        metaDescription: rest.metaDescription,
        benefits: Array.isArray(benefits)
          ? { create: benefits.map((b: any, i: number) => ({ label: b.label || b, sortOrder: i })) }
          : undefined,
        features: Array.isArray(features)
          ? {
              create: features.map((f: any, i: number) => ({
                title: f.title || f.label || f,
                description: f.description,
                iconKey: f.iconKey,
                sortOrder: f.sortOrder ?? i,
              })),
            }
          : undefined,
        learningSteps: Array.isArray(learningSteps)
          ? {
              create: learningSteps.map((s: any, i: number) => ({
                stepNumber: s.stepNumber ?? i + 1,
                title: s.title,
                description: s.description,
                sortOrder: s.sortOrder ?? i,
              })),
            }
          : undefined,
        curriculumItems: Array.isArray(curriculumItems)
          ? {
              create: curriculumItems.map((c: any, i: number) => ({
                title: c.title,
                bodyHtml: c.bodyHtml ? sanitizeRichTextHtml(c.bodyHtml) : null,
                sortOrder: c.sortOrder ?? i,
              })),
            }
          : undefined,
      },
    });
    if (Array.isArray(faqs) && faqs.length) {
      await this.prisma.faq.createMany({
        data: faqs.map((f: any, i: number) => ({
          courseId: course.id,
          question: f.question,
          answerHtml: sanitizeRichTextHtml(f.answerHtml || f.answer || ''),
          category: f.category ?? 'course',
          showOnHomepage: false,
          isVisible: f.isVisible ?? true,
          sortOrder: f.sortOrder ?? i,
        })),
      });
    }
    return this.getCourse(course.id);
  }
  async updateCourse(id: string, dto: any) {
    await this.getCourse(id);
    const { benefits, features, learningSteps, curriculumItems, faqs, ...rest } = dto;

    if (Array.isArray(benefits)) {
      await this.prisma.courseBenefit.deleteMany({ where: { courseId: id } });
      if (benefits.length) {
        await this.prisma.courseBenefit.createMany({
          data: benefits.map((b: any, i: number) => ({
            courseId: id,
            label: b.label || b,
            sortOrder: i,
          })),
        });
      }
    }
    if (Array.isArray(features)) {
      await this.prisma.courseFeature.deleteMany({ where: { courseId: id } });
      if (features.length) {
        await this.prisma.courseFeature.createMany({
          data: features.map((f: any, i: number) => ({
            courseId: id,
            title: f.title || f.label || f,
            description: f.description ?? null,
            iconKey: f.iconKey ?? null,
            sortOrder: f.sortOrder ?? i,
          })),
        });
      }
    }
    if (Array.isArray(learningSteps)) {
      await this.prisma.courseLearningStep.deleteMany({ where: { courseId: id } });
      if (learningSteps.length) {
        await this.prisma.courseLearningStep.createMany({
          data: learningSteps.map((s: any, i: number) => ({
            courseId: id,
            stepNumber: s.stepNumber ?? i + 1,
            title: s.title,
            description: s.description ?? null,
            sortOrder: s.sortOrder ?? i,
          })),
        });
      }
    }
    if (Array.isArray(curriculumItems)) {
      await this.prisma.courseCurriculumItem.deleteMany({ where: { courseId: id } });
      if (curriculumItems.length) {
        await this.prisma.courseCurriculumItem.createMany({
          data: curriculumItems.map((c: any, i: number) => ({
            courseId: id,
            title: c.title,
            bodyHtml: c.bodyHtml ? sanitizeRichTextHtml(c.bodyHtml) : null,
            sortOrder: c.sortOrder ?? i,
          })),
        });
      }
    }
    if (Array.isArray(faqs)) {
      await this.prisma.faq.updateMany({
        where: { courseId: id, deletedAt: null },
        data: { deletedAt: new Date() },
      });
      for (const [i, f] of faqs.entries()) {
        await this.prisma.faq.create({
          data: {
            courseId: id,
            question: f.question,
            answerHtml: sanitizeRichTextHtml(f.answerHtml || f.answer || ''),
            category: f.category ?? 'course',
            showOnHomepage: false,
            isVisible: f.isVisible ?? true,
            sortOrder: f.sortOrder ?? i,
          },
        });
      }
    }

    const {
      id: _id,
      createdAt: _c,
      updatedAt: _u,
      deletedAt: _d,
      benefits: _ben,
      features: _feat,
      learningSteps: _ls,
      curriculumItems: _ci,
      galleryItems: _gi,
      featuredImage: _fi,
      faqs: _faqs,
      inquiries: _inq,
      ...safe
    } = rest;

    return this.prisma.course.update({
      where: { id },
      data: {
        ...safe,
        ...(rest.longDescriptionHtml !== undefined
          ? { longDescriptionHtml: sanitizeRichTextHtml(rest.longDescriptionHtml) }
          : {}),
        ...(rest.eligibilityHtml !== undefined
          ? { eligibilityHtml: sanitizeRichTextHtml(rest.eligibilityHtml || '') }
          : {}),
        ...(rest.whoShouldJoinHtml !== undefined
          ? { whoShouldJoinHtml: sanitizeRichTextHtml(rest.whoShouldJoinHtml || '') }
          : {}),
        ...(rest.whyLearnHtml !== undefined
          ? { whyLearnHtml: sanitizeRichTextHtml(rest.whyLearnHtml || '') }
          : {}),
        ...(rest.whyChooseHtml !== undefined
          ? { whyChooseHtml: sanitizeRichTextHtml(rest.whyChooseHtml || '') }
          : {}),
        ...(rest.slug ? { slug: slugify(rest.slug) } : {}),
      },
      include: {
        ...this.courseInclude,
        faqs: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } },
      },
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
  listFaqs(admin = true, courseId?: string) {
    return this.prisma.faq.findMany({
      where: {
        deletedAt: null,
        ...(admin ? {} : { isVisible: true }),
        ...(courseId ? { courseId } : {}),
      },
      orderBy: { sortOrder: 'asc' },
    });
  }
  async createFaq(dto: any) {
    return this.prisma.faq.create({
      data: {
        question: dto.question,
        answerHtml: sanitizeRichTextHtml(dto.answerHtml || ''),
        category: dto.category,
        courseId: dto.courseId || null,
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
