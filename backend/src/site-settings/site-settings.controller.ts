import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Permissions, Public } from '../auth/decorators/auth.decorators';
import { SiteSettingsService } from './site-settings.service';

class UpdateSiteSettingsDto {
  @ApiPropertyOptional() @IsOptional() @IsString() businessName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tagline?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() logoMediaId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsUUID() faviconMediaId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() brandPrimary?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() brandAccent?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() whatsapp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() email?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() officeAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() businessHours?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() socialLinks?: Record<string, string>;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultMetaTitle?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultMetaDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headerCtaLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() headerCtaHref?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() headerCtaIsVisible?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() showTopBar?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() googleBusinessProfileUrl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() googleReviewsUrl?: string;
}

@ApiTags('Admin Site Settings')
@ApiBearerAuth()
@Controller('admin/site-settings')
export class SiteSettingsController {
  constructor(private readonly service: SiteSettingsService) {}

  @Get()
  @Permissions('settings.manage')
  @ApiOperation({ summary: 'Get site settings' })
  get() {
    return this.service.get();
  }

  @Patch()
  @Permissions('settings.manage')
  @ApiOperation({ summary: 'Update site settings' })
  update(@Body() dto: UpdateSiteSettingsDto) {
    return this.service.update(dto);
  }
}

@ApiTags('Public Site')
@Controller('public')
export class PublicSiteController {
  constructor(private readonly service: SiteSettingsService) {}

  @Public()
  @Get('site-settings')
  getPublic() {
    return this.service.get();
  }
}
