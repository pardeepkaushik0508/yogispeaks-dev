import { z } from 'zod';

/** Treat empty strings from `.env` files as undefined for optional variables. */
const optionalString = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().optional(),
);

/** Parse comma-separated origin URLs into a trimmed string array. */
const corsOriginsSchema = z
  .string()
  .min(1, 'CORS_ORIGINS must list at least one origin')
  .transform((value) =>
    value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  );

/** Parse boolean env vars stored as the strings "true" or "false". */
const booleanStringSchema = z
  .enum(['true', 'false'], {
    error: 'COOKIE_SECURE must be "true" or "false"',
  })
  .transform((value) => value === 'true');

/**
 * Zod schema for all backend environment variables.
 * Coaching CMS only — no travel-domain settings.
 */
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().int().positive(),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_ACCESS_SECRET: z
      .string()
      .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
    JWT_REFRESH_SECRET: z
      .string()
      .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
    JWT_ACCESS_EXPIRES_IN: z.string().min(1).default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
    FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
    CORS_ORIGINS: corsOriginsSchema,
    COOKIE_SECURE: z.preprocess(
      (value) => (value === '' || value === undefined ? 'false' : value),
      booleanStringSchema,
    ),
    SUPER_ADMIN_EMAIL: z.string().email('SUPER_ADMIN_EMAIL must be a valid email'),
    SUPER_ADMIN_PASSWORD: z
      .string()
      .min(12, 'SUPER_ADMIN_PASSWORD must be at least 12 characters'),
    REDIS_URL: z.preprocess(
      (value) => (value === '' || value === undefined ? undefined : value),
      z.string().min(1).optional(),
    ),
    SMTP_HOST: optionalString,
    SMTP_PORT: z.preprocess(
      (value) => (value === '' || value === undefined ? undefined : value),
      z.coerce.number().int().positive().optional(),
    ),
    SMTP_USER: optionalString,
    SMTP_PASSWORD: optionalString,
    SMTP_FROM_EMAIL: z.preprocess(
      (value) => (value === '' || value === undefined ? undefined : value),
      z.string().email().optional(),
    ),
    SMTP_FROM_NAME: optionalString,
    MEDIA_PROVIDER: z.enum(['local', 'cloudinary', 's3']).default('local'),
    CLOUDINARY_CLOUD_NAME: optionalString,
    CLOUDINARY_API_KEY: optionalString,
    CLOUDINARY_API_SECRET: optionalString,
    AWS_S3_BUCKET: optionalString,
    AWS_S3_REGION: optionalString,
    AWS_ACCESS_KEY_ID: optionalString,
    AWS_SECRET_ACCESS_KEY: optionalString,
  })
  // Keep nested keys from `configuration()` load factories (cors, jwt, …).
  .passthrough();

/** Validated, typed application environment. */
export type AppEnv = z.infer<typeof envSchema>;

/**
 * Validates raw config (typically `process.env`) at startup.
 * Throws a readable error when required coaching-platform settings are missing or invalid.
 */
export function validateEnv(config: Record<string, unknown>): AppEnv {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`Environment validation failed:\n${details}`);
  }

  return result.data;
}
