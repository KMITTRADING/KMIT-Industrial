/**
 * §6 bans twelve words outright. This fails the build on any of them, in either
 * locale, rather than trusting a read-through.
 *
 * It also flags the em-dash-free clichés that creep into industrial copy and
 * that the register test in §6 is meant to catch — those are warnings, not
 * failures, because judgement is required.
 *
 *   node --experimental-strip-types scripts/check-copy.mjs
 */
const { en } = await import('../content/en.ts');
const { ar } = await import('../content/ar.ts');

const BANNED = [
  'world-class', 'leading', 'cutting-edge', 'revolutionary', 'best-in-class',
  'innovative', 'seamless', 'empowering', 'unlock', 'elevate', 'harness',
  'solutions-driven',
];

/** Words that are not banned but are almost always filler in this register. */
const SUSPECT = ['synergy', 'holistic', 'state-of-the-art', 'premier', 'trusted partner', 'one-stop'];

function strings(value, prefix = '') {
  if (typeof value === 'string') return [[prefix, value]];
  if (value === null || typeof value !== 'object' || typeof value === 'function') return [];
  return Object.entries(value).flatMap(([k, v]) => strings(v, prefix ? `${prefix}.${k}` : k));
}

const failures = [];
const warnings = [];

for (const [locale, copy] of [['en', en], ['ar', ar]]) {
  for (const [path, text] of strings(copy)) {
    const haystack = text.toLowerCase();
    for (const word of BANNED) {
      // Word-boundary match, so "leading" does not fire on "misleading" and
      // "elevate" does not fire inside a longer word.
      if (new RegExp(`\\b${word.replace(/[-]/g, '[-\\s]')}\\b`).test(haystack)) {
        failures.push(`${locale}.${path}: banned "${word}" — ${JSON.stringify(text)}`);
      }
    }
    for (const word of SUSPECT) {
      if (haystack.includes(word)) warnings.push(`${locale}.${path}: suspect "${word}"`);
    }
  }
}

if (warnings.length) {
  console.log(`Warnings: ${warnings.length}`);
  for (const w of warnings) console.log(`  ? ${w}`);
}

if (failures.length) {
  console.log(`\nBanned words: ${failures.length}`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}

console.log(`No banned words in either locale. ${SUSPECT.length + BANNED.length} terms checked.`);
