import { Module } from '@nestjs/common';
import { HomepageController, PublicHomepageController } from './homepage.controller';
import { HomepageService } from './homepage.service';

@Module({
  controllers: [HomepageController, PublicHomepageController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}
