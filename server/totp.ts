// Minimal TOTP (RFC 6238) implementation for admin 2FA.
// Uses HMAC-SHA1 with 30-second steps, 6-digit codes.

import { createHmac, randomBytes } from 'crypto';

const PERIOD = 30; // seconds
const DIGITS = 6;

function hmacSha1(key: Buffer, counter: number): Buffer {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter), 0);
  return createHmac('sha1', key).update(buf).digest();
}

function dynamicTruncation(hmac: Buffer): number {
  const offset = hmac[hmac.length - 1] & 0x0f;
  return (
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)
  );
}

/**
 * Generate a new random base32-encoded TOTP secret.
 */
export function generateTotpSecret(): string {
  const bytes = randomBytes(20);
  return base32Encode(bytes);
}

/**
 * Verify a TOTP code against a secret. Allows ±1 step for clock drift.
 */
export function verifyTotp(secret: string, code: string): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const key = base32Decode(secret);
  if (!key) return false;
  const now = Math.floor(Date.now() / 1000);
  const counter = Math.floor(now / PERIOD);
  // Check current, previous, and next windows
  for (const offset of [-1, 0, 1]) {
    const expected = generateCode(key, counter + offset);
    if (expected === code) return true;
  }
  return false;
}

function generateCode(key: Buffer, counter: number): string {
  const hmac = hmacSha1(key, counter);
  const code = dynamicTruncation(hmac) % 1_000_000;
  return String(code).padStart(DIGITS, '0');
}

// Base32 encoding/decoding (RFC 4648, no padding)
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(data: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      output += ALPHABET[(value >>> bits) & 0x1f];
    }
  }
  if (bits > 0) {
    output += ALPHABET[(value << (5 - bits)) & 0x1f];
  }
  return output;
}

function base32Decode(encoded: string): Buffer | null {
  const cleaned = encoded.replace(/=+$/, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const idx = ALPHABET.indexOf(cleaned[i]);
    if (idx === -1) return null;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((value >>> bits) & 0xff);
    }
  }
  return Buffer.from(bytes);
}
