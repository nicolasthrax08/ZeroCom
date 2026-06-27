// Mock OCR adapter for PRC ID cards. Production: Baidu OCR / Tencent OCR / A-face.
// Returns a simulated verified result with a derived `idCardHash`.

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

export const ocrMock: OcrProvider = {
  async verifyPrcIdCard(imageUrl, realName) {
    if (!imageUrl) return { ok: false, idCardHash: '', idCardFrontUrl: '', ocrProvider: 'mock' };
    // Mock: deterministic hash using the real name + imageUrl prefix.
    const hash = `idcard-hash-${realName}-${imageUrl.slice(0, 12)}`;
    return {
      ok: true,
      extractedName: realName,
      extractedId: mockIdNumber(realName),
      idCardHash: `id-card-hash-${hash.length}`,
      idCardFrontUrl: imageUrl,
      ocrProvider: 'mock',
    };
  },
};

function mockIdNumber(realName: string): string {
  // Not a real ID number; returns a plausible-shaped placeholder.
  const tail = Math.floor(1000 + Math.random() * 9000);
  return `11010119900101${tail}`;
}
