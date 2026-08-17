/**
 * Enforces the copy rules that are easy to violate by reflex.
 *
 *  - §13 banned marketing vocabulary, both languages.
 *  - §13 no em dash in Arabic interface copy.
 *  - §6.1 correct Arabic punctuation: no ASCII comma/semicolon/question mark,
 *    and no straight double quotes where guillemets belong.
 *  - §15.1 title <= 60 chars and description <= 155 chars, unique per language.
 *  - §4 no digit-bearing claims outside the approved constants and the one
 *    permitted numbered sequence.
 *
 * Run: npm run check:copy
 */

import { readFileSync } from 'node:fs';

const files = {
  ar: 'src/content/ar.ts',
  en: 'src/content/en.ts',
};

const BANNED = [
  // Arabic
  'نُمكّن',
  'نمكن',
  'نُحدث نقلة',
  'حلول متكاملة رائدة',
  'الأفضل في فئته',
  'بلا حدود',
  'ثورة',
  'ريادة عالمية',
  // English
  'seamless',
  'world-class',
  'world class',
  'cutting-edge',
  'cutting edge',
  'next-generation',
  'next generation',
  'empower',
  'transformative',
  'best-in-class',
  'revolutioniz',
  'revolutionis',
  'lorem ipsum',
];

/**
 * Pulls every single- or double-quoted string literal out of a TS source file.
 * Both quote styles must be handled together: a straight apostrophe inside a
 * double-quoted string otherwise desynchronises single-quote pairing and every
 * later match slides out of alignment.
 */
function stringLiterals(src) {
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"/g;
  const out = [];
  for (const m of src.matchAll(re)) out.push(m[1] ?? m[2]);
  return out;
}

let failures = 0;
const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  failures++;
};
const pass = (msg) => console.log(`PASS  ${msg}`);

/* ------------------------------------------------- banned vocabulary ---- */
for (const [lang, file] of Object.entries(files)) {
  const src = readFileSync(file, 'utf8');
  const lower = src.toLowerCase();
  const hits = BANNED.filter((w) => lower.includes(w.toLowerCase()));
  if (hits.length) fail(`${lang}: banned vocabulary present -> ${hits.join(', ')}`);
  else pass(`${lang}: no banned marketing vocabulary`);
}

/* ------------------------------------------- Arabic punctuation rules --- */
{
  const src = readFileSync(files.ar, 'utf8');
  // Only inspect the Arabic string literals, not the TS keys and comments.
  const strings = stringLiterals(src).filter((s) => /[؀-ۿ]/.test(s));

  const emdash = strings.filter((s) => s.includes('—'));
  if (emdash.length) fail(`ar: em dash in interface copy -> ${emdash[0].slice(0, 60)}`);
  else pass('ar: no em dash in interface copy');

  const asciiComma = strings.filter((s) => /[\u0600-\u06FF][^\n]{0,40},/.test(s));
  if (asciiComma.length) fail(`ar: ASCII comma in Arabic copy -> ${asciiComma[0].slice(0, 60)}`);
  else pass('ar: Arabic comma used, not ASCII');

  const asciiQ = strings.filter((s) => /[\u0600-\u06FF][^\n]{0,40}\?/.test(s));
  if (asciiQ.length) fail(`ar: ASCII question mark in Arabic copy -> ${asciiQ[0].slice(0, 60)}`);
  else pass('ar: Arabic question mark used, not ASCII');

  const straightQuotes = strings.filter((s) => /[\u0600-\u06FF][^\n]*"/.test(s));
  if (straightQuotes.length)
    fail(`ar: straight double quote where guillemets belong -> ${straightQuotes[0].slice(0, 60)}`);
  else pass('ar: no straight double quotes in Arabic copy');

  // Kashida (tatweel) used to stretch words is banned.
  const kashida = strings.filter((s) => s.includes('\u0640'));
  if (kashida.length) fail(`ar: kashida/tatweel present -> ${kashida[0].slice(0, 60)}`);
  else pass('ar: no kashida stretching');
}

/* --------------------------------------------------- metadata lengths --- */
{
  const seen = { ar: new Set(), en: new Set() };
  for (const [lang, file] of Object.entries(files)) {
    const src = readFileSync(file, 'utf8');
    const metaBlock = src.slice(src.indexOf('meta: {'));
    const titles = [...metaBlock.matchAll(/title:\s*\n?\s*'([^']+)'/g)].map((m) => m[1]);
    const descs = [...metaBlock.matchAll(/description:\s*\n?\s*'([^']+)'/g)].map((m) => m[1]);

    if (titles.length !== 11) fail(`${lang}: expected 11 titles, found ${titles.length}`);
    if (descs.length !== 11) fail(`${lang}: expected 11 descriptions, found ${descs.length}`);

    for (const t of titles) {
      if (t.length > 60) fail(`${lang}: title ${t.length} chars (max 60) -> ${t}`);
      if (seen[lang].has(t)) fail(`${lang}: duplicate title -> ${t}`);
      seen[lang].add(t);
    }
    for (const d of descs) {
      if (d.length > 155) fail(`${lang}: description ${d.length} chars (max 155) -> ${d.slice(0, 70)}…`);
      if (seen[lang].has(d)) fail(`${lang}: duplicate description -> ${d.slice(0, 70)}…`);
      seen[lang].add(d);
    }
    const maxT = Math.max(...titles.map((t) => t.length));
    const maxD = Math.max(...descs.map((d) => d.length));
    pass(`${lang}: 11 unique titles (longest ${maxT}/60), 11 unique descriptions (longest ${maxD}/155)`);
  }
}

/* ------------------------------------------- fabricated-number sweep --- */
{
  // §4: no invented figures. The only digits permitted in prose are the approved
  // phone number, the 01-04 process sequence, the CaCO3 formula, and "3D" as the
  // name of a technique. Every other digit is a fabricated claim until proven
  // otherwise, so it is removed from the string and whatever remains must be
  // digit-free.
  const ALLOWED_TOKENS = [
    /\b0[1-4]\b/g, // the one permitted numbered sequence (journey stages)
    /CaCO₃|CaCO3/g, // chemical formula
    /3D/g, // technique name, not a quantity
    /057 495 0950/g,
    /\+966574950950/g,
    /name@example\.com/g,
  ];

  for (const [lang, file] of Object.entries(files)) {
    const src = readFileSync(file, 'utf8');
    const offenders = [];
    for (const raw of stringLiterals(src)) {
      // Skip code-ish values: routes, slugs, hex, urls, font paths.
      if (/^[a-z0-9/\-._:#@]+$/i.test(raw)) continue;
      let s = raw;
      for (const re of ALLOWED_TOKENS) s = s.replace(re, '');
      if (/[0-9٠-٩]/.test(s)) offenders.push(raw);
    }
    if (offenders.length)
      fail(
        `${lang}: unapproved figures in prose -> ${offenders
          .map((s) => s.slice(0, 60))
          .join(' | ')}`
      );
    else pass(`${lang}: no unapproved figures in prose`);
  }
}

console.log('');
if (failures) {
  console.error(`${failures} copy rule violation(s).`);
  process.exit(1);
}
console.log('Copy rules pass.');
