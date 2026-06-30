// Mock OCR adapter for PRC ID cards. Production: Baidu OCR / Tencent OCR / A-face.
// Returns a simulated verified result with a derived `idCardHash`.
import { createHash as createHashFn } from 'crypto';

function createHash(input: string): string {
  return createHashFn('sha256').update(input).digest('hex').slice(0, 16);
}

export interface OcrProvider {
  verifyPrcIdCard(imageUrl: string, realName: string): Promise<{
    ok: boolean;
    extractedName?: string;
    extractedId?: string;
    idCardHash: string;
    idCardFrontUrl: string;
    ocrProvider: string;
  }>;
}

// Trusted CDN hosts for ID card images. Production OCR must only fetch from these.
const TRUSTED_IMAGE_HOSTS = ['images.zerocom.app', 'cdn.zerocom.app'];

function isTrustedImageUrl(imageUrl: string): boolean {
  try {
    const u = new URL(imageUrl);
    return u.protocol === 'https:' && TRUSTED_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export const ocrMock: OcrProvider = {
  async verifyPrcIdCard(imageUrl, realName) {
    if (!imageUrl) return { ok: false, idCardHash: '', idCardFrontUrl: '', ocrProvider: 'mock' };
    // SSRF guard: only fetch from trusted hosts.
    if (!isTrustedImageUrl(imageUrl)) {
      return { ok: false, idCardHash: '', idCardFrontUrl: '', ocrProvider: 'mock' };
    }
    // M-06 FIX: Do NOT include the real name in the hash or return it in
    // plaintext. The real name is PII and must not leak into logs or hashes.
    // Use a salted hash of the image URL only.
    const hashInput = `${imageUrl}:${Date.now()}`;
    const idCardHash = createHash(hashInput);
    return {
      ok: true,
      extractedId: mockIdNumber(),
      idCardHash,
      idCardFrontUrl: imageUrl,
      ocrProvider: 'mock',
    };
  },
};

function mockIdNumber(): string {
  // Not a real ID number; returns a plausible-shaped placeholder.
  const tail = Math.floor(1000 + Math.random() * 9000);
  return `11010119900101${tail}`;
}
