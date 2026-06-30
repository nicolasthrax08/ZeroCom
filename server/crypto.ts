// AES-256-GCM encryption for PII (phone numbers, ID card numbers).
// Key must be 32 bytes, stored in ENCRYPTION_KEY env var as base64.

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;

let _key: Buffer | null = null;

function getKey(): Buffer {
  if (_key) return _key;
  const b64 = process.env.ENCRYPTION_KEY;
  if (!b64) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: ENCRYPTION_KEY must be set in production (base64-encoded 32-byte key)');
    }
    // Dev-only deterministic key — never used in production.
    _key = scryptSync('dev-only-key-do-not-use-in-prod', 'dev-salt', 32);
    return _key;
  }
  const key = Buffer.from(b64, 'base64');
  if (key.length !== 32) {
    throw new Error('FATAL: ENCRYPTION_KEY must decode to exactly 32 bytes');
  }
  _key = key;
  return key;
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Format: iv:tag:encrypted (all base64)
  return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decrypt(ciphertext: string): string {
  const key = getKey();
  const parts = ciphertext.split(':');
  if (parts.length !== 3) throw new Error('Invalid ciphertext format');
  const iv = Buffer.from(parts[0], 'base64');
  const tag = Buffer.from(parts[1], 'base64');
  const encrypted = Buffer.from(parts[2], 'base64');
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted) + decipher.final('utf8');
}

/**
 * Generate a new random 32-byte key (base64-encoded).
 * Run once and store the output in ENCRYPTION_KEY.
 */
export function generateKey(): string {
  return randomBytes(32).toString('base64');
}
