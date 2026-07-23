import { createHash, randomBytes } from 'node:crypto';

/**
 * Creates a cryptographically secure random token (hex string).
 */
export function createSecureToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

/**
 * Hashes a token with SHA-256 for safe database storage.
 * Raw tokens are never persisted.
 */
export function hashToken(rawToken: string): string {
  return createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Parses durations like "15m", "7d", "3600s" into milliseconds.
 */
export function parseDurationToMs(value: string): number {
  const match = /^(\d+)(ms|s|m|h|d)$/.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 'ms':
      return amount;
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60_000;
    case 'h':
      return amount * 3_600_000;
    case 'd':
      return amount * 86_400_000;
    default:
      throw new Error(`Invalid duration unit: ${unit}`);
  }
}
