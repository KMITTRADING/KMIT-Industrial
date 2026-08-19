/**
 * §12, the check the brief calls absolute: "Search the built site for any
 * number, date, certification, client name, or capability claim not in §1.
 * Zero results required."
 *
 * It reads the built HTML — not the source — because that is what ships, and
 * it strips script and style first so a coordinate inside JSON-LD is judged
 * once rather than twice.
 *
 * Every numeric token found in visible text must be on the allowlist. The
 * allowlist is short on purpose: if a number needs adding to it, that is the
 * moment to ask where the number came from.
 *
 *   node scripts/check-facts.mjs
 */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = new URL('../out/', import.meta.url).pathname;

/** Numbers the site is allowed to show, and why each one is defensible. */
const ALLOWED = [
  { pattern: /^\+?966\s?57\s?495\s?0950$/, why: 'the published phone number (§1)' },
  { pattern: /^\+?966574950950$/, why: 'the phone number in dial form (§1)' },
  { pattern: /^21\.4858$/, why: "Jeddah's latitude — a published city coordinate" },
  { pattern: /^39\.1925$/, why: "Jeddah's longitude — a published city coordinate" },
  { pattern: /^0[1-5]$/, why: 'a section or list index, not a quantity' },
  { pattern: /^20\d\d$/, why: 'the copyright year' },
];

const CLAIM_WORDS = [
  'certified', 'iso', 'accredited', 'award', 'years of experience', 'established',
  'founded', 'tonnes', 'tons', 'tonnage', 'capacity', 'purity', 'micron', 'mesh',
  'clients', 'customers served', 'projects completed', 'employees', 'staff of',
  'market share', 'turnover', 'revenue', 'largest', 'first in',
];

const files = (await readdir(OUT, { recursive: true }))
  .filter((f) => f.endsWith('.html'))
  .filter((f) => !f.includes('_not-found') && !f.startsWith('404'));

let failures = 0;
let checked = 0;

for (const file of files) {
  const html = await readFile(join(OUT, file), 'utf8');

  // Visible text only. Scripts carry JSON-LD and the framework payload; styles
  // carry pixel values. Neither is copy.
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  checked += 1;

  // Any run containing a digit, kept whole so "+966 57 495 0950" is judged as
  // one token rather than as four suspicious numbers.
  const tokens = text.match(/[+\d][\d\s.,°'-]*\d|\d/g) ?? [];
  const offenders = [];
  for (const raw of tokens) {
    const token = raw.trim().replace(/[.,]$/, '');
    if (ALLOWED.some(({ pattern }) => pattern.test(token))) continue;
    offenders.push(token);
  }

  const claims = CLAIM_WORDS.filter((word) => text.toLowerCase().includes(word));

  if (offenders.length || claims.length) {
    failures += 1;
    console.log(`\n${file}`);
    if (offenders.length) console.log(`  unexplained numbers: ${[...new Set(offenders)].join(' | ')}`);
    if (claims.length) console.log(`  claim words: ${claims.join(', ')}`);
  } else {
    console.log(`${file.padEnd(16)} clean`);
  }
}

console.log(`\n${checked} documents checked, ${failures} with findings.`);
console.log('Allowed numbers:');
for (const { pattern, why } of ALLOWED) console.log(`  ${String(pattern).padEnd(28)} ${why}`);
process.exit(failures ? 1 : 0);
