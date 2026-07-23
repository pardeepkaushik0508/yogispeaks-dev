import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions, Public } from '../auth/decorators/auth.decorators';
import { HomepageService } from './homepage.service';

@ApiTags('Admin Homepage')
@ApiBearerAuth()
@Controller('admin/homepage')
export class HomepageController {
  constructor(private readonly service: HomepageService) {}

  @Get() @Permissions('homepage.manage')
  bundle() { return this.service.getAdminBundle(); }

  @Patch('sections/:id') @Permissions('homepage.manage')
  updateSection(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.service.updateSection(id, dto); }

  @Post('stats') @Permissions('homepage.manage') createStat(@Body() dto: Record<string, unknown>) { return this.service.createStat(dto); }
  @Patch('stats/:id') @Permissions('homepage.manage') updateStat(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.service.updateStat(id, dto); }
  @Delete('stats/:id') @Permissions('homepage.manage') deleteStat(@Param('id') id: string) { return this.service.deleteStat(id); }

  @Post('features') @Permissions('homepage.manage') createFeature(@Body() dto: Record<string, unknown>) { return this.service.createFeature(dto); }
  @Patch('features/:id') @Permissions('homepage.manage') updateFeature(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.service.updateFeature(id, dto); }
  @Delete('features/:id') @Permissions('homepage.manage') deleteFeature(@Param('id') id: string) { return this.service.deleteFeature(id); }

  @Post('steps') @Permissions('homepage.manage') createStep(@Body() dto: Record<string, unknown>) { return this.service.createStep(dto); }
  @Patch('steps/:id') @Permissions('homepage.manage') updateStep(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.service.updateStep(id, dto); }
  @Delete('steps/:id') @Permissions('homepage.manage') deleteStep(@Param('id') id: string) { return this.service.deleteStep(id); }

  @Post('benefits') @Permissions('homepage.manage') createBenefit(@Body() dto: Record<string, unknown>) { return this.service.createBenefit(dto); }
  @Patch('benefits/:id') @Permissions('homepage.manage') updateBenefit(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.service.updateBenefit(id, dto); }
  @Delete('benefits/:id') @Permissions('homepage.manage') deleteBenefit(@Param('id') id: string) { return this.service.deleteBenefit(id); }

  @Post('reorder/:collection') @Permissions('homepage.manage')
  reorder(@Param('collection') collection: string, @Body() body: { ids: string[] }) {
    const map: Record<string, any> = {
      stats: 'homepageStat', features: 'feature', steps: 'learningStep', benefits: 'benefitItem', sections: 'homepageSection',
    };
    return this.service.reorder(map[collection], body.ids);
  }
}

@ApiTags('Public Homepage')
@Controller('public/homepage')
export class PublicHomepageController {
  constructor(private readonly service: HomepageService) {}
  @Public() @Get()
  bundle() { return this.service.getPublicBundle(); }
}
