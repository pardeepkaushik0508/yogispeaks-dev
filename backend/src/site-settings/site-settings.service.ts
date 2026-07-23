import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const existing = await this.prisma.siteSetting.findFirst();
    if (existing) return existing;
    return this.prisma.siteSetting.create({ data: {} });
  }

  async update(data: Prisma.SiteSettingUpdateInput) {
    const current = await this.get();
    return this.prisma.siteSetting.update({
      where: { id: current.id },
      data,
    });
  }
}
