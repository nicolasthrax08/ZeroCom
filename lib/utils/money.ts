export function formatRMB(fen: number): string {
  const yuan = fen / 100;
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: yuan >= 10000 ? 0 : 2,
  }).format(yuan);
}

export function yuanToFen(yuan: number): number {
  return Math.round(yuan * 100);
}

export function wanToFen(wan: number): number {
  return Math.round(wan * 10000 * 100);
}

export function fenToYuan(fen: number): number {
  return fen / 100;
}

export function fenToWan(fen: number): number {
  return fen / 1000000;
}

export function formatWan(wan: number): string {
  if (wan >= 10000) {
    const yi = wan / 10000;
    return `${yi.toFixed(yi >= 100 ? 0 : 1)}亿`;
  }
  return `${wan.toLocaleString('zh-CN')}万`;
}
