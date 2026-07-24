/**
 * Prisma CLI configuration for Prisma 7+
 *
 * Used for:
 * - Prisma Client generation
 * - Database migrations
 * - Database seeding
 *
 * NestJS runtime database queries use:
 * PrismaClient + @prisma/adapter-pg
 */

import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

/**
 * Load backend/.env for local development.
 *
 * override: false means:
 * - Render's DATABASE_URL gets priority in production.
 * - Local .env is used only when the variable is not already available.
 * - Production variables are not overwritten by the local .env file.
 */
loadEnv({
  path: path.resolve(__dirname, '.env'),
  override: false,
});

/**
 * During Docker image build, DATABASE_URL may not be available.
 *
 * `prisma generate` does not need a live database connection,
 * so an empty fallback allows client generation to complete.
 *
 * During migrations and application runtime, Render provides
 * the real DATABASE_URL through environment variables.
 */
const databaseUrl = process.env.DATABASE_URL ?? '';

export default defineConfig({
  /**
   * Main Prisma schema location.
   */
  schema: path.resolve(__dirname, 'prisma/schema.prisma'),

  /**
   * Migration and seed configuration.
   */
  migrations: {
    path: path.resolve(__dirname, 'prisma/migrations'),
    seed: 'tsx prisma/seed.ts',
  },

  /**
   * Database connection used by Prisma CLI commands.
   */
  datasource: {
    url: databaseUrl,
  },
});