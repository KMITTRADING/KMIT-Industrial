/**
 * §12: "Programmatically diff the en and ar content keys. Report any gap."
 *
 * The Copy type already makes a missing key a compile error, so this should
 * never find a structural gap — that is the point. It exists because the
 * checklist asks for a report rather than an assurance, and because it catches
 * two things the type cannot: an empty string that satisfies `string`, and a
 * line left in the wrong language.
 *
 *   node --experimental-strip-types scripts/check-i18n.mjs
 */
const { en } = await import('../content/en.ts');
const { ar } = await import('../content/ar.ts');

/** Every leaf path in the object, as dotted strings. Functions are leaves. */
function paths(value, prefix = '') {
  if (value === null || typeof value !== 'object') return [prefix];
  if (typeof value === 'function') return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    paths(child, prefix ? `${prefix}.${key}` : key),
  );
}

/** The leaf at a dotted path. */
const at = (obj, path) => path.split('.').reduce((node, key) => node?.[key], obj);

const enPaths = paths(en);
const arPaths = paths(ar);

const missingInAr = enPaths.filter((p) => !arPaths.includes(p));
const missingInEn = arPaths.filter((p) => !enPaths.includes(p));

// A key can exist in both and still be broken: blank, or never translated.
const ARABIC = /[؀-ۿ]/;
const LATIN_WORD = /[A-Za-z]{3,}/;

const blank = [];
const untranslated = [];

for (const path of arPaths) {
  const value = at(ar, path);
  if (typeof value !== 'string') continue;
  if (value.trim() === '') blank.push(path);

  // Arabic copy with no Arabic characters is almost always an untranslated
  // leftover. `switchTo` and `languageName` are meant to be Latin — they name
  // the other language to its own speakers.
  const intentionallyLatin = path === 'switchTo' || path === 'languageName';
  if (!intentionallyLatin && !ARABIC.test(value) && LATIN_WORD.test(value)) {
    untranslated.push(`${path} = ${JSON.stringify(value)}`);
  }
}

for (const path of enPaths) {
  const value = at(en, path);
  if (typeof value === 'string' && value.trim() === '') blank.push(`en:${path}`);
}

const report = (title, items) => {
  console.log(`\n${title}: ${items.length}`);
  for (const item of items) console.log(`  - ${item}`);
};

console.log(`en keys: ${enPaths.length}   ar keys: ${arPaths.length}`);
report('missing in ar', missingInAr);
report('missing in en', missingInEn);
report('blank values', blank);
report('ar values with no Arabic script', untranslated);

const failures = missingInAr.length + missingInEn.length + blank.length + untranslated.length;
console.log(`\n${failures === 0 ? 'No gaps.' : `${failures} problems.`}`);
process.exit(failures ? 1 : 0);
