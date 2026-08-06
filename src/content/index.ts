import type { Locale } from '@/i18n/routing';

import { ar } from './ar';
import { en } from './en';

import type { Content } from './schema';

/**
 * The locale-indexed content tree.
 *
 * Both modules are typed against `Content` with `satisfies`, so a missing or
 * misspelled key is a TypeScript error at authoring time. `npm run check:i18n`
 * additionally parses both trees against the zod schema and diffs their key
 * paths, which catches the case TypeScript cannot: a key that exists in both
 * but is empty, over-length, or structurally different.
 */
export const content: Record<Locale, Content> = { ar, en };

export function getContent(locale: Locale): Content {
  return content[locale];
}

export type { Content } from './schema';
