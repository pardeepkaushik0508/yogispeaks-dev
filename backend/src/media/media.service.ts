import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaProvider } from '@prisma/client';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, extname } from 'path';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMediaDto } from './dto/media.dto';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const MAX_BYTES = 15 * 1024 * 1024;

@Injectable()
export class MediaService {
  private readonly uploadDir: string;

  constructor(private readonly prisma: PrismaService) {
    this.uploadDir = join(process.cwd(), 'uploads');
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Express.Multer.File, createdById?: string) {
    if (!file) throw new BadRequestException('File is required');
    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new BadRequestException(
        'Unsupported file type. Allowed: images, PDF, DOC, DOCX',
      );
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('File too large (max 15MB)');
    }

    const ext = extname(file.originalname) || '.bin';
    const filename = `${randomUUID()}${ext}`;
    writeFileSync(join(this.uploadDir, filename), file.buffer);

    return this.prisma.mediaAsset.create({
      data: {
        url: `/uploads/${filename}`,
        provider: MediaProvider.LOCAL,
        mimeType: file.mimetype,
        byteSize: file.size,
        title: file.originalname,
        alt: file.originalname,
        createdById,
      },
    });
  }

  async list(q?: string, page = 1, pageSize = 24) {
    const where = {
      deletedAt: null,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' as const } },
              { alt: { contains: q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.mediaAsset.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async get(id: string) {
    const row = await this.prisma.mediaAsset.findFirst({
      where: { id, deletedAt: null },
    });
    if (!row) throw new NotFoundException('Media not found');
    return row;
  }

  async update(id: string, dto: UpdateMediaDto) {
    await this.get(id);
    return this.prisma.mediaAsset.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.get(id);
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
