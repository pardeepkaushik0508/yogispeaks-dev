/**
 * NestJS ConfigModule factory.
 * Maps flat `process.env` values into a nested object for `ConfigService` lookups.
 */
function parseCorsOrigins(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((origin) => String(origin).trim()).filter(Boolean);
  }

  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  cors: {
    origins: parseCorsOrigins(process.env.CORS_ORIGINS),
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  },
  redis: {
    url: process.env.REDIS_URL || undefined,
  },
  smtp: {
    host: process.env.SMTP_HOST || undefined,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
    user: process.env.SMTP_USER || undefined,
    password: process.env.SMTP_PASSWORD || undefined,
    fromEmail: process.env.SMTP_FROM_EMAIL || undefined,
    fromName: process.env.SMTP_FROM_NAME || undefined,
  },
  media: {
    provider: process.env.MEDIA_PROVIDER,
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || undefined,
      apiKey: process.env.CLOUDINARY_API_KEY || undefined,
      apiSecret: process.env.CLOUDINARY_API_SECRET || undefined,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET || undefined,
      region: process.env.AWS_S3_REGION || undefined,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || undefined,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || undefined,
    },
  },
});
