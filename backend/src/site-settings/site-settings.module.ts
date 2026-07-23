import { Module } from '@nestjs/common';
import {
  PublicSiteController,
  SiteSettingsController,
} from './site-settings.controller';
import { SiteSettingsService } from './site-settings.service';

@Module({
  controllers: [SiteSettingsController, PublicSiteController],
  providers: [SiteSettingsService],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
