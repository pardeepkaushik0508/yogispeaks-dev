import { Module } from '@nestjs/common';
import {
  BlogCategoriesController,
  BlogsController,
  CoursesController,
  FaqsController,
  PagesController,
  PublicContentController,
  TestimonialsController,
} from './cms.controller';
import { CmsService } from './cms.service';

@Module({
  controllers: [
    PagesController,
    CoursesController,
    FaqsController,
    TestimonialsController,
    BlogCategoriesController,
    BlogsController,
    PublicContentController,
  ],
  providers: [CmsService],
  exports: [CmsService],
})
export class CmsModule {}
