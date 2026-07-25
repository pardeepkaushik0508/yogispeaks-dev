import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { validateEnv } from './config/env.validation';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { HealthModule } from './health/health.module';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma/prisma.module';
import { MediaModule } from './media/media.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { NavigationModule } from './navigation/navigation.module';
import { HomepageModule } from './homepage/homepage.module';
import { CmsModule } from './cms/cms.module';
import { UsersModule } from './users/users.module';
import { OpsModule } from './ops/ops.module';

/**
 * Root application module for the YogiSpeaks coaching CMS backend.
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
      },
    ]),
    PrismaModule,
    MailModule,
    AuthModule,
    HealthModule,
    MediaModule,
    SiteSettingsModule,
    NavigationModule,
    HomepageModule,
    CmsModule,
    UsersModule,
    OpsModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
