/**
 * Verifies every text/ground pair in the design system against WCAG 2.1 AA.
 * Body text >= 4.5:1, large headings >= 3:1. Exits non-zero on any failure so
 * this can gate CI. Run: npm run check:contrast
 */

const TOKENS = {
  brand: '#2B3073',
  'brand-mid': '#3D55A4',
  'brand-deep': '#1B1F4E',
  'brand-tint': '#EEF0F7',
  line: '#D9DBE6',
  ink: '#14173A',
  'ink-soft': '#4A4F73',
  paper: '#FAF9F6',
  surface: '#FFFFFF',
  mineral: '#E8E5DE',
  white: '#FFFFFF',
};

/** sRGB hex -> relative luminance per WCAG 2.1 */
function luminance(hex) {
  const n = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Flattens a translucent white overlay onto an opaque ground. */
function overWhite(alpha, groundHex) {
  const n = groundHex.replace('#', '');
  const ch = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const mixed = ch.map((c) => Math.round(alpha * 255 + (1 - alpha) * c));
  return '#' + mixed.map((c) => c.toString(16).padStart(2, '0')).join('');
}

function ratio(aHex, bHex) {
  const [l1, l2] = [luminance(aHex), luminance(bHex)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const t = TOKENS;
const PAIRS = [
  // [label, foreground, background, minimum]
  ['ink on paper (body)', t.ink, t.paper, 4.5],
  ['ink on surface (body)', t.ink, t.surface, 4.5],
  ['ink on brand-tint (body)', t.ink, t['brand-tint'], 4.5],
  ['ink on mineral (body)', t.ink, t.mineral, 4.5],
  ['ink-soft on paper (secondary body)', t['ink-soft'], t.paper, 4.5],
  ['ink-soft on surface (secondary body)', t['ink-soft'], t.surface, 4.5],
  ['ink-soft on brand-tint (secondary body)', t['ink-soft'], t['brand-tint'], 4.5],
  ['brand on paper (links)', t.brand, t.paper, 4.5],
  ['brand on surface (links)', t.brand, t.surface, 4.5],
  ['brand on brand-tint (links)', t.brand, t['brand-tint'], 4.5],
  ['brand-mid on paper (links)', t['brand-mid'], t.paper, 4.5],
  ['brand-mid on surface (links)', t['brand-mid'], t.surface, 4.5],
  ['white on brand-deep (body)', t.white, t['brand-deep'], 4.5],
  ['white on brand (body)', t.white, t.brand, 4.5],
  ['white on brand-mid (body)', t.white, t['brand-mid'], 4.5],
  ['white .72 on brand-deep (secondary)', overWhite(0.72, t['brand-deep']), t['brand-deep'], 4.5],
  ['white .72 on brand (secondary)', overWhite(0.72, t.brand), t.brand, 4.5],
  // gradient endpoints: white must clear AA at both ends of --grad-brand
  ['white on grad start #2B3073', t.white, '#2B3073', 4.5],
  ['white on grad end #3D55A4', t.white, '#3D55A4', 4.5],
  // focus ring must be visible against every ground it can land on
  ['focus ring brand-mid vs paper', t['brand-mid'], t.paper, 3],
  ['focus ring white vs brand-deep', t.white, t['brand-deep'], 3],
];

/*
 * A dark section is not actually --brand-deep: `.on-dark::before` lays the 135deg
 * identity gradient over it at 34% opacity, so the ground text really sits on is
 * lighter than the token. Testing against the token alone would pass while the
 * rendered page failed, so both ends of the gradient are flattened and checked.
 */
const GRADIENT_ENDS = [
  ['grad start', '#2B3073'],
  ['grad end', '#3D55A4'],
];

function overColour(fgHex, alpha, bgHex) {
  const parse = (h) => [0, 2, 4].map((i) => parseInt(h.replace('#', '').slice(i, i + 2), 16));
  const f = parse(fgHex);
  const b = parse(bgHex);
  return (
    '#' +
    f
      .map((c, i) => Math.round(alpha * c + (1 - alpha) * b[i]).toString(16).padStart(2, '0'))
      .join('')
  );
}

for (const [label, end] of GRADIENT_ENDS) {
  const ground = overColour(end, 0.34, t['brand-deep']);
  PAIRS.push([`white on dark section (${label})`, t.white, ground, 4.5]);
  PAIRS.push([
    `white .72 on dark section (${label})`,
    overColour(t.white, 0.72, ground),
    ground,
    4.5,
  ]);
}

let failed = 0;
const rows = PAIRS.map(([label, fg, bg, min]) => {
  const r = ratio(fg, bg);
  const pass = r >= min;
  if (!pass) failed++;
  return { label, ratio: r.toFixed(2), min: min.toFixed(1), pass };
});

const width = Math.max(...rows.map((r) => r.label.length));
for (const r of rows) {
  console.log(
    `${r.pass ? 'PASS' : 'FAIL'}  ${r.label.padEnd(width)}  ${r.ratio.padStart(6)}:1  (min ${r.min})`
  );
}

console.log(`\n${rows.length - failed}/${rows.length} pairs pass WCAG 2.1 AA.`);
if (failed) {
  console.error(`${failed} contrast failure(s).`);
  process.exit(1);
}
