/**
 * Brief §10: "Verify every colour pair >= 4.5:1 (small text) and give me the
 * measured values."
 *
 * The pairs are declared here rather than scraped out of the components,
 * because the question is which combinations the design permits — a pair that
 * fails should fail the build whether or not a component happens to use it yet.
 *
 * Colours are read from styles/tokens.css, so this measures the real palette
 * and cannot drift away from it.
 *
 *   node scripts/check-contrast.mjs
 */
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../styles/tokens.css', import.meta.url), 'utf8');

const token = (name) => {
  const hit = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{3,8})\\s*;`, 'i'));
  if (!hit) throw new Error(`token --${name} is not a hex value in tokens.css`);
  return hit[1];
};

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const luminance = (hex) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
};

const ratio = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

/* Every pair the design allows, classified by the floor that actually applies.
   A pair that fails should fail the build whether or not a component happens to
   use it yet — the question is what the design permits.

   text     — WCAG 1.4.3, 4.5:1. All body copy, labels, links, button text.
   nontext  — WCAG 1.4.11, 3:1. UI state and graphics that carry meaning.
   decor    — no floor. Pure decoration: a reader who cannot see it loses
              nothing. Measured and reported anyway, so the choice is visible
              and someone can challenge it. */
const PAIRS = [
  ['text', 'body text', 'ink', 'paper'],
  ['text', 'secondary text', 'ink-soft', 'paper'],
  ['text', 'brand text and links', 'brand', 'paper'],
  ['text', 'brand-2 accent text', 'brand-2', 'paper'],

  ['text', 'body on surface', 'ink', 'surface'],
  ['text', 'secondary on surface', 'ink-soft', 'surface'],
  ['text', 'brand on surface', 'brand', 'surface'],

  ['text', 'body on active row wash', 'ink', 'brand-wash'],
  ['text', 'secondary on active row wash', 'ink-soft', 'brand-wash'],
  ['text', 'brand on active row wash', 'brand', 'brand-wash'],

  ['text', 'body on mineral', 'ink', 'mineral'],
  ['text', 'secondary on mineral', 'ink-soft', 'mineral'],

  ['text', 'button label on brand', 'paper', 'brand'],
  ['text', 'region text on brand', 'on-dark', 'brand'],
  ['text', 'region secondary on brand', 'on-dark-soft', 'brand'],

  // The gradient's light end is the worst case for anything sitting on the
  // dark section, so it is tested as well as the dark end.
  ['text', 'region text on gradient end', 'on-dark', 'brand-2'],
  ['text', 'region secondary on gradient end', 'on-dark-soft', 'brand-2'],
  ['text', 'button label on gradient end', 'paper', 'brand-2'],

  ['nontext', 'focus ring on paper', 'brand', 'paper'],
  ['nontext', 'focus ring on surface', 'brand', 'surface'],
  ['nontext', 'region arc on brand', 'on-dark-line', 'brand'],
  ['nontext', 'region arc on gradient end', 'on-dark-line', 'brand-2'],

  ['decor', 'strata rule on paper', 'line', 'paper'],
  ['decor', 'heavy strata rule on paper', 'line-strong', 'paper'],
  ['decor', 'strata rule on surface', 'line', 'surface'],
  ['decor', 'recessive rings on brand', 'on-dark-line-soft', 'brand'],
];

const FLOOR = { text: 4.5, nontext: 3, decor: 0 };

let failed = 0;
const rows = PAIRS.map(([kind, label, fg, bg]) => {
  const min = FLOOR[kind];
  const value = ratio(token(fg), token(bg));
  const pass = value >= min;
  if (!pass) failed += 1;
  return {
    kind,
    label,
    pair: `${fg} on ${bg}`,
    measured: `${value.toFixed(2)}:1`,
    min: min ? `${min}:1` : '—',
    pass,
  };
});

const w = (k, pad) => rows.reduce((m, r) => Math.max(m, String(r[k]).length), pad);
const [lw, pw] = [w('label', 5), w('pair', 6)];

for (const kind of ['text', 'nontext', 'decor']) {
  const group = rows.filter((r) => r.kind === kind);
  const heading = {
    text: 'TEXT — WCAG 1.4.3, floor 4.5:1',
    nontext: 'NON-TEXT — WCAG 1.4.11, floor 3:1',
    decor: 'DECORATIVE — no floor, reported for review',
  }[kind];
  console.log(`\n${heading}`);
  console.log('-'.repeat(lw + pw + 24));
  for (const r of group) {
    console.log(
      `${r.label.padEnd(lw)}  ${r.pair.padEnd(pw)}  ${r.measured.padStart(8)}  ${r.min.padEnd(6)}  ${r.pass ? 'pass' : 'FAIL'}`,
    );
  }
}

const asserted = rows.filter((r) => FLOOR[r.kind] > 0).length;
console.log(`\n${rows.length} pairs measured, ${asserted} asserted, ${failed} failing.`);
process.exit(failed ? 1 : 0);
