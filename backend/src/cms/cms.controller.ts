import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions, Public } from '../auth/decorators/auth.decorators';
import { CmsService } from './cms.service';

@ApiTags('Admin Pages')
@ApiBearerAuth()
@Controller('admin/pages')
export class PagesController {
  constructor(private readonly cms: CmsService) {}
  @Get() @Permissions('pages.manage') list() { return this.cms.listPages(); }
  @Get(':id') @Permissions('pages.manage') get(@Param('id') id: string) { return this.cms.getPage(id); }
  @Post() @Permissions('pages.manage') create(@Body() dto: Record<string, unknown>) { return this.cms.createPage(dto); }
  @Patch(':id') @Permissions('pages.manage') update(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.cms.updatePage(id, dto); }
  @Delete(':id') @Permissions('pages.manage') remove(@Param('id') id: string) { return this.cms.deletePage(id); }
}

@ApiTags('Admin Courses')
@ApiBearerAuth()
@Controller('admin/courses')
export class CoursesController {
  constructor(private readonly cms: CmsService) {}
  @Get() @Permissions('courses.manage') list() { return this.cms.listCourses(true); }
  @Get(':id') @Permissions('courses.manage') get(@Param('id') id: string) { return this.cms.getCourse(id); }
  @Post() @Permissions('courses.manage') create(@Body() dto: Record<string, unknown>) { return this.cms.createCourse(dto); }
  @Patch(':id') @Permissions('courses.manage') update(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.cms.updateCourse(id, dto); }
  @Delete(':id') @Permissions('courses.manage') remove(@Param('id') id: string) { return this.cms.deleteCourse(id); }
  @Post('reorder') @Permissions('courses.manage') reorder(@Body() body: { ids: string[] }) { return this.cms.reorderCourses(body.ids); }
}

@ApiTags('Admin FAQs')
@ApiBearerAuth()
@Controller('admin/faqs')
export class FaqsController {
  constructor(private readonly cms: CmsService) {}
  @Get() @Permissions('faqs.manage') list() { return this.cms.listFaqs(true); }
  @Post() @Permissions('faqs.manage') create(@Body() dto: Record<string, unknown>) { return this.cms.createFaq(dto); }
  @Patch(':id') @Permissions('faqs.manage') update(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.cms.updateFaq(id, dto); }
  @Delete(':id') @Permissions('faqs.manage') remove(@Param('id') id: string) { return this.cms.deleteFaq(id); }
  @Post('reorder') @Permissions('faqs.manage') reorder(@Body() body: { ids: string[] }) { return this.cms.reorderFaqs(body.ids); }
}

@ApiTags('Admin Testimonials')
@ApiBearerAuth()
@Controller('admin/testimonials')
export class TestimonialsController {
  constructor(private readonly cms: CmsService) {}
  @Get() @Permissions('testimonials.manage') list() { return this.cms.listTestimonials(true); }
  @Post() @Permissions('testimonials.manage') create(@Body() dto: Record<string, unknown>) { return this.cms.createTestimonial(dto); }
  @Patch(':id') @Permissions('testimonials.manage') update(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.cms.updateTestimonial(id, dto); }
  @Delete(':id') @Permissions('testimonials.manage') remove(@Param('id') id: string) { return this.cms.deleteTestimonial(id); }
  @Post('reorder') @Permissions('testimonials.manage') reorder(@Body() body: { ids: string[] }) { return this.cms.reorderTestimonials(body.ids); }
}

@ApiTags('Admin Blog Categories')
@ApiBearerAuth()
@Controller('admin/blog-categories')
export class BlogCategoriesController {
  constructor(private readonly cms: CmsService) {}
  @Get() @Permissions('blogs.manage') list() { return this.cms.listBlogCategories(); }
  @Post() @Permissions('blogs.manage') create(@Body() dto: Record<string, unknown>) { return this.cms.createBlogCategory(dto); }
  @Patch(':id') @Permissions('blogs.manage') update(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.cms.updateBlogCategory(id, dto); }
  @Delete(':id') @Permissions('blogs.manage') remove(@Param('id') id: string) { return this.cms.deleteBlogCategory(id); }
}

@ApiTags('Admin Blogs')
@ApiBearerAuth()
@Controller('admin/blogs')
export class BlogsController {
  constructor(private readonly cms: CmsService) {}
  @Get() @Permissions('blogs.manage') list() { return this.cms.listBlogPosts(true); }
  @Get(':id') @Permissions('blogs.manage') get(@Param('id') id: string) { return this.cms.getBlogPost(id); }
  @Post() @Permissions('blogs.manage') create(@Body() dto: Record<string, unknown>) { return this.cms.createBlogPost(dto); }
  @Patch(':id') @Permissions('blogs.manage') update(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.cms.updateBlogPost(id, dto); }
  @Delete(':id') @Permissions('blogs.manage') remove(@Param('id') id: string) { return this.cms.deleteBlogPost(id); }
}

@ApiTags('Public Content')
@Controller('public')
export class PublicContentController {
  constructor(private readonly cms: CmsService) {}
  @Public() @Get('pages/:slug') page(@Param('slug') slug: string) { return this.cms.getPageBySlug(slug); }
  @Public() @Get('courses') courses() { return this.cms.listCourses(false); }
  @Public() @Get('courses/:slug') course(@Param('slug') slug: string) { return this.cms.getCourseBySlug(slug); }
  @Public() @Get('faqs') faqs() { return this.cms.listFaqs(false); }
  @Public() @Get('testimonials') testimonials() { return this.cms.listTestimonials(false); }
  @Public() @Get('blogs') blogs() { return this.cms.listBlogPosts(false); }
}
