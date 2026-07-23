import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AdminStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.adminUser.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, email: true, fullName: true, status: true, lastLoginAt: true, createdAt: true,
        roles: { include: { role: true } },
      },
    });
  }

  listRoles() {
    return this.prisma.role.findMany({ orderBy: { name: 'asc' }, include: { permissions: { include: { permission: true } } } });
  }

  async create(dto: { email: string; fullName: string; password: string; roleIds: string[] }) {
    const exists = await this.prisma.adminUser.findFirst({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');
    const passwordHash = await argon2.hash(dto.password);
    return this.prisma.adminUser.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        roles: { create: dto.roleIds.map((roleId) => ({ roleId })) },
      },
      include: { roles: { include: { role: true } } },
    });
  }

  async update(id: string, dto: any) {
    const user = await this.prisma.adminUser.findFirst({ where: { id, deletedAt: null } });
    if (!user) throw new NotFoundException('User not found');
    if (Array.isArray(dto.roleIds)) {
      await this.prisma.adminUserRole.deleteMany({ where: { adminUserId: id } });
      await this.prisma.adminUserRole.createMany({ data: dto.roleIds.map((roleId: string) => ({ adminUserId: id, roleId })) });
    }
    const { roleIds, password, ...rest } = dto;
    const data: any = { ...rest };
    if (password) data.passwordHash = await argon2.hash(password);
    return this.prisma.adminUser.update({
      where: { id },
      data,
      include: { roles: { include: { role: true } } },
    });
  }

  async remove(id: string) {
    return this.prisma.adminUser.update({ where: { id }, data: { deletedAt: new Date(), status: AdminStatus.INACTIVE } });
  }
}
