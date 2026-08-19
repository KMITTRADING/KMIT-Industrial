import type { Locale } from '@/lib/locales';
import type { Copy } from './types';
import { ar } from './ar';
import { en } from './en';

/** Both locales, keyed. Typed as Copy, so neither can drift from the contract. */
export const COPY: Record<Locale, Copy> = { ar, en };

export function getCopy(locale: Locale): Copy {
  return COPY[locale];
}
