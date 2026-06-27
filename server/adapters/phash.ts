// Mock perceptual hash adapter. Production would use a real image pHash library
// and search Postgres or Elastic for near-duplicates.

export function generatePHash(imageUrl: string): string {
  // Deterministic faux-phash; 64-char hex.
  let h = 0;
  for (let i = 0; i < imageUrl.length; i++) {
    h = (h << 5) - h + imageUrl.charCodeAt(i);
    h |= 0;
  }
  const seed = Math.abs(h).toString(16).padStart(8, '0');
  return (seed + seed + seed + seed + seed + seed).slice(0, 64);
}

export function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  let same = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) same++;
  }
  return same / Math.max(a.length, b.length);
}

export function likelyDuplicate(a: string, b: string): boolean {
  return similarity(a, b) >= 0.8;
}
