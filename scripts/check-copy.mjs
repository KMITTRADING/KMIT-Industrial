/**
 * Copy gate.
 *
 * Three mechanical checks over everything that reaches a reader's eyes: the
 * localised content tree and the alt text in the asset map.
 *
 * 1. No em dash, no en dash, no double hyphen. The em dash is the single most
 *    recognisable generated-text tell, and once it appears in one string it
 *    spreads through a site by imitation. Ranges use a plain hyphen; a sentence
 *    that wants an em dash wants a comma, a colon, or two sentences.
 *
 * 2. No middle-dot pile-ups. One separator dot in a metadata line is a
 *    typographic choice; four in a row is a generated-page signature. A list
 *    with more than one dot should be a real list, with hairlines or columns
 *    doing the separating.
 *
 * 3. No filler superlatives. CLAUDE.md §6 and .agents/product-marketing.md §9
 *    list the phrases a technical buyer reads as an admission that no number
 *    exists. Every one of them is a substitute for a figure, and this project
 *    has the figures. Checked in both languages, because "world-class quality"
 *    and "جودة عالمية" fail for the same reason.
 *
 * This deliberately does NOT scan source comments or documentation. Those are
 * written for the team, not rendered to a visitor. The gate is about the page.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(import.meta.dirname, '..');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const ASSET_MAP = path.join(ROOT, 'docs', 'asset-map.json');

const BANNED_DASH = /[\u2014\u2013]|(?<![-\w])--(?![-\w])/;
const DOT_PILE_UP = /(·[^·\n]*){2,}·/;

/**
 * Filler that stands in for a figure. Each entry is matched case-insensitively
 * against rendered copy. The list is the union of CLAUDE.md §6 and
 * .agents/product-marketing.md §9, in both languages.
 */
const BANNED_PHRASES = [
  'innovative',
  'world-class',
  'world class',
  'trusted partner',
  'cutting-edge',
  'cutting edge',
  'premium quality',
  'best prices',
  'state-of-the-art',
  'best in class',
  'best-in-class',
  'حلول مبتكرة',
  'شريكك الموثوق',
  'الأفضل في المجال',
  'جودة عالمية',
  'أفضل الأسعار',
  'جودة ممتازة',
];

const failures = [];

/** Every string literal in a TS module, with its line number. */
function stringLiterals(source) {
  const found = [];
  source.split('\n').forEach((line, index) => {
    // Skip comment lines: they are for the team, not the reader.
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
    for (const match of line.matchAll(
      /'([^'\\]*(?:\\.[^'\\]*)*)'|"([^"\\]*(?:\\.[^"\\]*)*)"/g,
    )) {
      const value = match[1] ?? match[2] ?? '';
      if (value.length > 0) found.push({ line: index + 1, value });
    }
  });
  return found;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

function check(where, value) {
  if (BANNED_DASH.test(value)) {
    failures.push({
      where,
      rule: 'dash',
      detail: `contains an em dash, en dash or double hyphen: "${value.slice(0, 90)}"`,
    });
  }
  if (DOT_PILE_UP.test(value)) {
    failures.push({
      where,
      rule: 'separator',
      detail: `more than one middle dot on a line: "${value.slice(0, 90)}"`,
    });
  }
  const lowered = value.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lowered.includes(phrase)) {
      failures.push({
        where,
        rule: 'filler',
        detail: `banned phrase "${phrase}": "${value.slice(0, 90)}"`,
      });
    }
  }
}

for (const file of await walk(CONTENT_DIR)) {
  const relative = path.relative(ROOT, file);
  const source = await readFile(file, 'utf8');
  for (const literal of stringLiterals(source)) {
    check(`${relative}:${literal.line}`, literal.value);
  }
}

const assetMap = JSON.parse(await readFile(ASSET_MAP, 'utf8'));
for (const asset of assetMap.assets ?? []) {
  check(`docs/asset-map.json ${asset.target} alt_ar`, asset.alt_ar ?? '');
  check(`docs/asset-map.json ${asset.target} alt_en`, asset.alt_en ?? '');
}

if (failures.length > 0) {
  console.error(`check:copy failed with ${failures.length} problem(s):\n`);
  for (const failure of failures) {
    console.error(`  [${failure.rule}] ${failure.where}\n      ${failure.detail}`);
  }
  console.error(
    '\nUse a plain hyphen for ranges and compounds. For a sentence break use a comma,\n' +
      'a colon, parentheses, or two sentences. For lists, use a real list.\n' +
      'For a filler phrase, state the number, the standard or the test method instead.',
  );
  process.exit(1);
}

console.log(
  'check:copy passed - no banned dashes, separator pile-ups or filler phrases in rendered copy.',
);
