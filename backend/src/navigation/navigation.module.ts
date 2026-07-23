import { Module } from '@nestjs/common';
import { NavigationController, PublicNavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';

@Module({
  controllers: [NavigationController, PublicNavigationController],
  providers: [NavigationService],
  exports: [NavigationService],
})
export class NavigationModule {}
