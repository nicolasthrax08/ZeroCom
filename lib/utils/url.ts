export function classNames(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(' ');
}

export function buildQuery(params: Record<string, string | number | undefined | null>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null && v !== '') usp.set(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export function qs(params: Record<string, unknown>): string {
  return buildQuery(params as Record<string, string | number | undefined>);
}
