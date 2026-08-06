/**
 * Locale parity gate.
 *
 * TypeScript already catches a missing key, because both content modules are
 * written with `satisfies Content`. This catches what the type system cannot:
 *
 *   - a key present in both locales but empty or whitespace-only
 *   - a title over 60 characters or a description over 155
 *   - an answer-first paragraph that has been trimmed to a sentence
 *   - a structural difference — an object in one locale, a string in the other
 *
 * Run by `npm run check:i18n` and by CI. Exits non-zero on any drift.
 */

import { ar } from '../src/content/ar/index';
import { en } from '../src/content/en/index';
import { contentSchema, keyPaths } from '../src/content/schema';

type Failure = { locale: string; detail: string };

const failures: Failure[] = [];
const locales = [
  { name: 'ar', content: ar as unknown },
  { name: 'en', content: en as unknown },
];

for (const { name, content } of locales) {
  const result = contentSchema.safeParse(content);
  if (!result.success) {
    for (const issue of result.error.issues) {
      failures.push({
        locale: name,
        detail: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
      });
    }
  }
}

const arPaths = keyPaths(ar);
const enPaths = keyPaths(en);

const missingInEn = arPaths.filter((path) => !enPaths.includes(path));
const missingInAr = enPaths.filter((path) => !arPaths.includes(path));

for (const path of missingInEn) {
  failures.push({ locale: 'en', detail: `missing key present in ar: ${path}` });
}
for (const path of missingInAr) {
  failures.push({ locale: 'ar', detail: `missing key present in en: ${path}` });
}

/**
 * ICU placeholders must match across locales. A translated string that drops
 * `{min}` renders a coating level of "Stearic acid –%" and nobody notices until
 * a customer quotes it back.
 */
function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)[^}]*\}/g)].map((match) => match[1] ?? '').sort();
}

function walkStrings(value: unknown, prefix: string, into: Map<string, string>): void {
  if (typeof value === 'string') {
    into.set(prefix, value);
    return;
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      walkStrings(child, prefix ? `${prefix}.${key}` : key, into);
    }
  }
}

const arStrings = new Map<string, string>();
const enStrings = new Map<string, string>();
walkStrings(ar, '', arStrings);
walkStrings(en, '', enStrings);

for (const [path, arValue] of arStrings) {
  const enValue = enStrings.get(path);
  if (enValue === undefined) continue;
  const arPlaceholders = placeholders(arValue).join(',');
  const enPlaceholders = placeholders(enValue).join(',');
  if (arPlaceholders !== enPlaceholders) {
    failures.push({
      locale: 'both',
      detail: `ICU placeholder mismatch at ${path}: ar has [${arPlaceholders}], en has [${enPlaceholders}]`,
    });
  }
}

if (failures.length > 0) {
  console.error(`check:i18n failed with ${failures.length} problem(s):\n`);
  for (const failure of failures) {
    console.error(`  [${failure.locale}] ${failure.detail}`);
  }
  process.exit(1);
}

console.log(
  `check:i18n passed — ${arPaths.length} keys mirrored across ar and en, ` +
    `${arStrings.size} strings validated.`,
);
