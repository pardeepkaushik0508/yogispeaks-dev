import { Module } from '@nestjs/common';
import { OpsController, PublicLeadsController } from './ops.controller';
import { OpsService } from './ops.service';

@Module({
  controllers: [OpsController, PublicLeadsController],
  providers: [OpsService],
  exports: [OpsService],
})
export class OpsModule {}
