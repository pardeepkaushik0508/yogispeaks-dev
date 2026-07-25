import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { InquiryStatus } from '@prisma/client';
import { CurrentUser, Permissions, Public } from '../auth/decorators/auth.decorators';
import type { AuthUser } from '../auth/interfaces/jwt-payload.interface';
import { OpsService } from './ops.service';

@ApiTags('Admin Ops')
@ApiBearerAuth()
@Controller('admin')
export class OpsController {
  constructor(private readonly ops: OpsService) {}

  @Get('inquiries') @Permissions('inquiries.manage') listInquiries() { return this.ops.listInquiries(); }
  @Get('inquiries/export') @Permissions('inquiries.manage')
  async exportInquiries(@Res() res: Response) {
    const csv = await this.ops.exportInquiriesCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="inquiries.csv"');
    res.send(csv);
  }
  @Get('inquiries/:id') @Permissions('inquiries.manage') getInquiry(@Param('id') id: string) { return this.ops.getInquiry(id); }
  @Patch('inquiries/:id/status') @Permissions('inquiries.manage')
  updateStatus(@Param('id') id: string, @Body() body: { status: InquiryStatus }) { return this.ops.updateInquiryStatus(id, body.status); }
  @Post('inquiries/:id/notes') @Permissions('inquiries.manage')
  addNote(@Param('id') id: string, @Body() body: { body: string }, @CurrentUser() user: AuthUser) {
    return this.ops.addInquiryNote(id, body.body, user.id);
  }

  @Get('newsletter') @Permissions('newsletter.manage') listSubs() { return this.ops.listSubscribers(); }
  @Get('newsletter/export') @Permissions('newsletter.manage')
  async exportSubs(@Res() res: Response) {
    const csv = await this.ops.exportSubscribersCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="newsletter.csv"');
    res.send(csv);
  }
  @Delete('newsletter/:id') @Permissions('newsletter.manage') removeSub(@Param('id') id: string) { return this.ops.removeSubscriber(id); }

  @Get('email-templates') @Permissions('email_templates.manage') listTemplates() { return this.ops.listEmailTemplates(); }
  @Get('email-templates/:id') @Permissions('email_templates.manage') getTemplate(@Param('id') id: string) { return this.ops.getEmailTemplate(id); }
  @Patch('email-templates/:id') @Permissions('email_templates.manage') updateTemplate(@Param('id') id: string, @Body() dto: Record<string, unknown>) { return this.ops.updateEmailTemplate(id, dto); }

  @Get('audit-logs') @Permissions('audit.read')
  audit(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.ops.listAuditLogs(Number(page) || 1, Number(pageSize) || 50);
  }

  @Get('dashboard/stats') @Permissions('dashboard.read')
  stats() { return this.ops.dashboardStats(); }
}

@ApiTags('Public Leads')
@Controller('public')
export class PublicLeadsController {
  constructor(private readonly ops: OpsService) {}

  @Public()
  @Post('inquiries')
  createInquiry(@Body() body: Record<string, unknown>) {
    return this.ops.createPublicInquiry({
      type: body.type === 'CONTACT' ? 'CONTACT' : 'ASSESSMENT',
      fullName: String(body.fullName || body.name || ''),
      email: String(body.email || ''),
      mobile: body.mobile || body.phone ? String(body.mobile || body.phone) : undefined,
      whatsapp: body.whatsapp ? String(body.whatsapp) : undefined,
      interestedCourseLabel: body.interestedCourseLabel || body.preferredCourse
        ? String(body.interestedCourseLabel || body.preferredCourse)
        : undefined,
      communicationLevel: body.communicationLevel || body.currentLevel
        ? String(body.communicationLevel || body.currentLevel)
        : undefined,
      learningGoal: body.learningGoal ? String(body.learningGoal) : undefined,
      preferredTiming: body.preferredTiming ? String(body.preferredTiming) : undefined,
      preferredContactMethod: body.preferredContactMethod
        ? String(body.preferredContactMethod)
        : undefined,
      message: body.message ? String(body.message) : undefined,
      country: body.country ? String(body.country) : undefined,
      sourcePage: body.sourcePage ? String(body.sourcePage) : undefined,
      consentAccepted: body.consentAccepted !== false,
    });
  }

  @Public()
  @Post('newsletter')
  subscribe(@Body() body: { email?: string; source?: string }) {
    return this.ops.subscribeNewsletter(String(body.email || ''), body.source);
  }
}
