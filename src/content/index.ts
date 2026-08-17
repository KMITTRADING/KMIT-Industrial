import type { Locale } from '@/lib/i18n';
import { ar, type Dict } from './ar';
import { en } from './en';

const DICTS: Record<Locale, Dict> = { ar, en };

export function dict(locale: Locale): Dict {
  return DICTS[locale];
}

export type { Dict };
export { ar, en };
