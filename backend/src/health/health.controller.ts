import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/decorators/auth.decorators';
import { PrismaService } from '../prisma/prisma.service';

/** Health and readiness probes for the coaching platform API. */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /** Basic liveness check — confirms the Nest process is responding. */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Liveness probe' })
  check(): { status: 'ok' } {
    return { status: 'ok' };
  }

  /** Database readiness — runs a lightweight `SELECT 1` via Prisma. */
  @Public()
  @Get('db')
  @ApiOperation({ summary: 'Database readiness probe' })
  async checkDatabase(): Promise<{ status: 'ok' }> {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok' };
  }

  /**
   * Redis readiness stub.
   * Returns `skipped` when REDIS_URL is not configured (optional in early phases).
   */
  @Public()
  @Get('redis')
  @ApiOperation({ summary: 'Redis readiness probe (stub when REDIS_URL is unset)' })
  checkRedis(): { status: 'ok' } | { status: 'skipped'; reason: string } {
    const redisUrl = this.configService.get<string>('redis.url');

    if (!redisUrl) {
      return {
        status: 'skipped',
        reason: 'REDIS_URL is not configured',
      };
    }

    return { status: 'ok' };
  }
}
