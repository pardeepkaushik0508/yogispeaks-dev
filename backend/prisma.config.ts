/**
 * Prisma CLI configuration (Prisma 7+).
 * Runtime queries use PrismaClient + @prisma/adapter-pg in NestJS PrismaModule.
 */
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Always load backend/.env (avoids picking up a stale root DATABASE_URL).
loadEnv({ path: path.join(__dirname, '.env'), override: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
