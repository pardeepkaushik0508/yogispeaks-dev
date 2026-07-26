import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(cookieParser());

  /** Never spread a raw string (that yields single characters as "origins"). */
  const normalizeOrigins = (value: unknown): string[] => {
    const parts = Array.isArray(value)
      ? value.map(String)
      : typeof value === 'string'
        ? value.split(',')
        : [];

    return parts
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter((origin) => origin.length > 0 && origin.includes('://'));
  };

  const allowedOrigins = Array.from(
    new Set([
      ...normalizeOrigins(configService.get('cors.origins')),
      ...normalizeOrigins(configService.get('CORS_ORIGINS')),
      ...normalizeOrigins(configService.get('frontend.url')),
      ...normalizeOrigins(configService.get('FRONTEND_URL')),
    ]),
  );

  const isAllowedOrigin = (origin: string): boolean => {
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized)) {
      return true;
    }
    // Render preview / static hostnames change; allow HTTPS *.onrender.com
    try {
      const host = new URL(normalized).hostname.toLowerCase();
      return host.endsWith('.onrender.com');
    } catch {
      return false;
    }
  };

  app.enableCors({
    origin: (origin, callback) => {
      // Non-browser clients (no Origin) are allowed.
      if (!origin) {
        callback(null, true);
        return;
      }
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
  });

  logger.log(
    `CORS origins: ${allowedOrigins.join(', ') || '(none listed)'} + *.onrender.com`,
  );

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('YogiSpeaks API')
    .setDescription(
      'Communication coaching CMS API — courses, testimonials, inquiries, and site content.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port =
    configService.get<number>('port') ??
    configService.get<number>('PORT') ??
    4000;
  await app.listen(port);

  logger.log(`YogiSpeaks API listening on http://localhost:${port}/api/v1`);
  logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}

void bootstrap();
