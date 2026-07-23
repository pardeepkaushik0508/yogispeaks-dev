import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { NavLocation, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavigationService {
  constructor(private readonly prisma: PrismaService) {}

  list(location?: NavLocation) {
    return this.prisma.navigationItem.findMany({
      where: location ? { location } : undefined,
      orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }],
      include: { children: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async create(data: Prisma.NavigationItemCreateInput) {
    return this.prisma.navigationItem.create({ data });
  }

  async update(id: string, data: Prisma.NavigationItemUpdateInput) {
    await this.ensure(id);
    return this.prisma.navigationItem.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.ensure(id);
    return this.prisma.navigationItem.delete({ where: { id } });
  }

  async reorder(ids: string[]) {
    if (!ids?.length) throw new BadRequestException('ids required');
    await this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.navigationItem.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
    return { ok: true };
  }

  private async ensure(id: string) {
    const row = await this.prisma.navigationItem.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Navigation item not found');
    return row;
  }
}
