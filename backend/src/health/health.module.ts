import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

/** Registers coaching platform health/readiness endpoints under `/api/v1/health`. */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
