import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Injectable Prisma client for the YogiSpeaks coaching CMS.
 *
 * Prisma 7 requires a driver adapter for PostgreSQL instead of opening connections
 * inside the generated client. We use `@prisma/adapter-pg` with `DATABASE_URL`
 * from {@link ConfigService} so Nest can manage configuration and lifecycle.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('database.url');

    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured');
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  /** Connects to PostgreSQL when the Nest application module initializes. */
  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  /** Gracefully closes the pool when the application shuts down. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
