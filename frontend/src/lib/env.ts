import { z } from 'zod';
import { DEFAULT_API_URL } from './api-base';

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url(),
  NEXT_PUBLIC_API_URL: z.url(),
  NEXT_PUBLIC_TINYMCE_API_KEY: z.string().optional(),
});

function parsePublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL,
    NEXT_PUBLIC_TINYMCE_API_KEY:
      process.env.NEXT_PUBLIC_TINYMCE_API_KEY || undefined,
  });

  if (!result.success) {
    throw new Error(
      `Invalid public environment variables: ${result.error.message}`,
    );
  }

  return result.data;
}

/** Validated public env vars safe for client bundles. */
export const publicEnv = parsePublicEnv();

export type PublicEnv = z.infer<typeof publicEnvSchema>;
