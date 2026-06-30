import { cookies } from 'next/headers';
import { translate, type DictKey, type Lang } from './dictionary';
import { label as enumLabel, type EnumMap } from '../utils/i18n';

// Resolve the active language from the persisted cookie on the server.
// Falls back to the default 'zh'. Use in server components / route handlers
// so SSR paint matches the client language before hydration syncs.
export async function serverLang(): Promise<Lang> {
  const c = await cookies();
  return c.get('zerocom_lang')?.value === 'en' ? 'en' : 'zh';
}

// Bound translator for server components: `const t = await serverT(); t('key')` or t('key', { n: 1 }).
export async function serverT(): Promise<(key: DictKey, params?: Record<string, string | number>) => string> {
  const lang = await serverLang();
  return (key: DictKey, params?: Record<string, string | number>) => translate(key, lang, params);
}

// Bound enum-label resolver for server components.
export async function serverLabel(): Promise<(map: EnumMap, key: string) => string> {
  const lang = await serverLang();
  return (map: EnumMap, key: string) => enumLabel(map, key, lang);
}
