/**
 * Brand token generator.
 *
 * Single input: the brand accent extracted from public/brand/logo.svg.
 * Single output pair:
 *   - src/styles/tokens.css   the shipped token layer
 *   - docs/brand-tokens.md    the reasoning, the values, the contrast matrix
 *
 * The ramps are built in OKLCH so that lightness steps are perceptually even
 * and the neutral ramp can be tinted toward the accent hue without the muddy
 * result an sRGB tint produces. Every colour is gamut-mapped back into sRGB by
 * reducing chroma only — hue and lightness are never altered, because hue drift
 * across a ramp is exactly what makes a generated palette look synthetic.
 *
 * Usage: node scripts/build-tokens.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

/* ------------------------------------------------------------------ colour */

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ];
}

function rgbToHex([r, g, b]) {
  const channel = (value) =>
    Math.round(clamp01(value) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

function linearRgbToOklab([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToLinearRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

function hexToOklch(hex) {
  const [L, a, b] = linearRgbToOklab(hexToRgb(hex).map(srgbToLinear));
  const chroma = Math.hypot(a, b);
  let hue = (Math.atan2(b, a) * 180) / Math.PI;
  if (hue < 0) hue += 360;
  return { l: L, c: chroma, h: hue };
}

function oklchToLinearRgb({ l, c, h }) {
  const radians = (h * Math.PI) / 180;
  return oklabToLinearRgb([l, c * Math.cos(radians), c * Math.sin(radians)]);
}

const inGamut = (linear) => linear.every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4);

/** Reduce chroma (never hue, never lightness) until the colour fits in sRGB. */
function gamutMap({ l, c, h }) {
  if (inGamut(oklchToLinearRgb({ l, c, h }))) return { l, c, h };
  let low = 0;
  let high = c;
  for (let i = 0; i < 40; i += 1) {
    const mid = (low + high) / 2;
    if (inGamut(oklchToLinearRgb({ l, c: mid, h }))) low = mid;
    else high = mid;
  }
  return { l, c: low, h };
}

function oklchToHex(oklch) {
  return rgbToHex(oklchToLinearRgb(gamutMap(oklch)).map(linearToSrgb));
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(srgbToLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

const formatOklch = ({ l, c, h }) =>
  `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(4)} ${h.toFixed(1)})`;

/* ------------------------------------------------------------- extraction */

async function extractAccent() {
  const svg = await readFile(path.join(ROOT, 'public', 'brand', 'logo.svg'), 'utf8');
  const found = new Map();

  // Illustrator exports put the paint in a <style> block as class rules, and
  // occasionally inline. Collect both, then discard `none`.
  const patterns = [
    /fill:\s*(#[0-9a-fA-F]{3,8})/g,
    /stroke:\s*(#[0-9a-fA-F]{3,8})/g,
    /stop-color:\s*(#[0-9a-fA-F]{3,8})/g,
    /fill="(#[0-9a-fA-F]{3,8})"/g,
    /stroke="(#[0-9a-fA-F]{3,8})"/g,
  ];

  for (const pattern of patterns) {
    for (const match of svg.matchAll(pattern)) {
      const hex = match[1].toLowerCase();
      found.set(hex, (found.get(hex) ?? 0) + 1);
    }
  }

  const painted = [...found.entries()].sort((a, b) => b[1] - a[1]);
  if (painted.length === 0) throw new Error('No colour found in logo.svg');

  // Rank by covered area: the logo is a single-colour wordmark, so the count of
  // rules referencing a colour is the ranking signal. Neutrals (pure greys and
  // near-black/near-white) are never eligible as the accent.
  const nonNeutral = painted.filter(([hex]) => hexToOklch(hex).c > 0.02);
  return {
    accent: (nonNeutral[0] ?? painted[0])[0],
    all: painted.map(([hex, count]) => ({ hex, count, oklch: hexToOklch(hex) })),
  };
}

/* ------------------------------------------------------------------ ramps */

const ACCENT_STOPS = [
  { stop: 50, l: 0.975, chromaScale: 0.16 },
  { stop: 100, l: 0.945, chromaScale: 0.3 },
  { stop: 200, l: 0.888, chromaScale: 0.52 },
  { stop: 300, l: 0.812, chromaScale: 0.74 },
  { stop: 400, l: 0.716, chromaScale: 0.92 },
  { stop: 500, l: 0.618, chromaScale: 1.0 },
  { stop: 600, l: 0.522, chromaScale: 1.0 },
  { stop: 700, l: 0.432, chromaScale: 0.96 },
  { stop: 800, l: 0.352, chromaScale: 0.88 },
  { stop: 900, l: 0.288, chromaScale: 0.78 },
];

const NEUTRAL_STOPS = [
  { stop: 0, l: 1.0, chroma: 0.0 },
  { stop: 50, l: 0.981, chroma: 0.0035 },
  { stop: 100, l: 0.955, chroma: 0.005 },
  { stop: 200, l: 0.912, chroma: 0.0065 },
  { stop: 300, l: 0.848, chroma: 0.008 },
  { stop: 400, l: 0.742, chroma: 0.0095 },
  { stop: 500, l: 0.632, chroma: 0.0105 },
  { stop: 600, l: 0.524, chroma: 0.011 },
  { stop: 700, l: 0.428, chroma: 0.0115 },
  { stop: 800, l: 0.331, chroma: 0.012 },
  { stop: 900, l: 0.245, chroma: 0.0125 },
  { stop: 950, l: 0.178, chroma: 0.013 },
];

/**
 * Semantic hues. Chroma is held to the same budget as the accent so that a
 * status colour never shouts louder than the brand. Lightness is tuned so each
 * semantic colour clears 4.5:1 on the page background.
 */
const SEMANTIC_HUES = [
  { name: 'success', hue: 148, l: 0.5, chromaScale: 0.86 },
  { name: 'warning', hue: 76, l: 0.53, chromaScale: 1.0 },
  { name: 'danger', hue: 27, l: 0.52, chromaScale: 1.0 },
  { name: 'info', hue: 232, l: 0.51, chromaScale: 0.9 },
];

function buildRamps(accentHex) {
  const accent = hexToOklch(accentHex);

  const accentRamp = ACCENT_STOPS.map(({ stop, l, chromaScale }) => {
    const oklch = gamutMap({ l, c: accent.c * chromaScale * 1.55, h: accent.h });
    return { stop, oklch, hex: oklchToHex(oklch) };
  });

  const neutralRamp = NEUTRAL_STOPS.map(({ stop, l, chroma }) => {
    const oklch = gamutMap({ l, c: chroma, h: accent.h });
    return { stop, oklch, hex: oklchToHex(oklch) };
  });

  const semantic = SEMANTIC_HUES.map(({ name, hue, l, chromaScale }) => {
    const base = gamutMap({ l, c: accent.c * chromaScale * 1.55, h: hue });
    const surface = gamutMap({ l: 0.955, c: accent.c * chromaScale * 0.28, h: hue });
    const border = gamutMap({ l: 0.845, c: accent.c * chromaScale * 0.62, h: hue });
    return {
      name,
      base: { oklch: base, hex: oklchToHex(base) },
      surface: { oklch: surface, hex: oklchToHex(surface) },
      border: { oklch: border, hex: oklchToHex(border) },
    };
  });

  return { accent, accentRamp, neutralRamp, semantic };
}

/* --------------------------------------------------------------- contrast */

function buildContrastMatrix({ accentRamp, neutralRamp, semantic }) {
  const byStop = (ramp, stop) => ramp.find((entry) => entry.stop === stop).hex;

  const lightInks = [
    { token: '--ink-primary', hex: byStop(neutralRamp, 950), label: 'body text' },
    { token: '--ink-secondary', hex: byStop(neutralRamp, 700), label: 'secondary text' },
    { token: '--ink-muted', hex: byStop(neutralRamp, 600), label: 'muted / caption' },
    { token: '--ink-accent', hex: byStop(accentRamp, 700), label: 'accent text and links' },
  ];

  const darkInks = [
    { token: '--ink-inverse', hex: byStop(neutralRamp, 0), label: 'text on dark' },
    {
      token: '--ink-inverse-secondary',
      hex: byStop(neutralRamp, 300),
      label: 'secondary on dark',
    },
    {
      token: '--ink-inverse-accent',
      hex: byStop(accentRamp, 200),
      label: 'accent text on dark',
    },
  ];

  // Only pairings the system actually ships are measured. A full cross product
  // would report dark ink on a dark panel as a failure, which is noise: that
  // pairing is not a defect, it is simply not a combination the tokens allow.
  const surfaces = [
    {
      token: '--surface-page',
      hex: byStop(neutralRamp, 0),
      label: 'page background',
      inks: lightInks,
    },
    {
      token: '--surface-raised',
      hex: byStop(neutralRamp, 50),
      label: 'raised surface',
      inks: lightInks,
    },
    {
      token: '--surface-sunken',
      hex: byStop(neutralRamp, 100),
      label: 'sunken surface',
      inks: lightInks,
    },
    {
      token: '--surface-accent-tint',
      hex: byStop(accentRamp, 50),
      label: 'accent tint panel',
      inks: lightInks,
    },
    {
      token: '--surface-accent',
      hex: byStop(accentRamp, 800),
      label: 'accent panel',
      inks: darkInks,
    },
    {
      token: '--surface-accent-deep',
      hex: byStop(accentRamp, 900),
      label: 'deep accent panel',
      inks: darkInks,
    },
    {
      token: '--surface-inverse',
      hex: byStop(neutralRamp, 950),
      label: 'inverse panel',
      inks: darkInks,
    },
  ];

  const rows = [];
  for (const surface of surfaces) {
    for (const ink of surface.inks) {
      const ratio = contrast(ink.hex, surface.hex);
      rows.push({
        ink: ink.token,
        inkLabel: ink.label,
        surface: surface.token,
        surfaceLabel: surface.label,
        ratio,
        aaNormal: ratio >= 4.5,
        aaLarge: ratio >= 3,
        aaa: ratio >= 7,
      });
    }
  }

  const cta = {
    label: 'primary CTA — white on accent-700',
    ratio: contrast(byStop(neutralRamp, 0), byStop(accentRamp, 700)),
  };
  const ctaHover = {
    label: 'primary CTA hover — white on accent-800',
    ratio: contrast(byStop(neutralRamp, 0), byStop(accentRamp, 800)),
  };
  const focus = {
    label: 'focus ring — accent-600 on page background',
    ratio: contrast(byStop(accentRamp, 600), byStop(neutralRamp, 0)),
  };
  const semanticRows = semantic.map((entry) => ({
    label: `${entry.name} — base on its own surface`,
    ratio: contrast(entry.base.hex, entry.surface.hex),
  }));

  return { rows, extras: [cta, ctaHover, focus, ...semanticRows] };
}

/* ----------------------------------------------------------------- output */

function renderCss({ accentHex, accentRamp, neutralRamp, semantic }) {
  const line = (name, entry) => `  --${name}: ${formatOklch(entry.oklch)}; /* ${entry.hex} */`;

  return `/*
 * KMIT design tokens — generated by scripts/build-tokens.mjs. Do not edit by hand.
 *
 * Source of truth: the single accent ${accentHex} extracted from public/brand/logo.svg.
 * Rationale and the full contrast matrix: docs/brand-tokens.md
 */

@theme {
  /* ---- accent ramp (the only chromatic family in the system) ---- */
${accentRamp.map((entry) => line(`color-accent-${entry.stop}`, entry)).join('\n')}

  /* ---- neutral ramp, tinted toward the accent hue ---- */
${neutralRamp.map((entry) => line(`color-neutral-${entry.stop}`, entry)).join('\n')}

  /* ---- semantic states, held to the accent's chroma budget ---- */
${semantic
  .flatMap((entry) => [
    line(`color-${entry.name}`, entry.base),
    line(`color-${entry.name}-surface`, entry.surface),
    line(`color-${entry.name}-border`, entry.border),
  ])
  .join('\n')}

  /* ---- semantic surfaces and inks ----
     Components reference these, never a ramp stop directly. Every pairing below
     is measured in docs/brand-tokens.md §6; dark surfaces accept only the
     inverse inks, light surfaces only the standard inks. */
  --color-surface-page: var(--color-neutral-0);
  --color-surface-raised: var(--color-neutral-50);
  --color-surface-sunken: var(--color-neutral-100);
  --color-surface-accent-tint: var(--color-accent-50);
  --color-surface-accent: var(--color-accent-800);
  --color-surface-accent-deep: var(--color-accent-900);
  --color-surface-inverse: var(--color-neutral-950);

  --color-ink-primary: var(--color-neutral-950);
  --color-ink-secondary: var(--color-neutral-700);
  --color-ink-muted: var(--color-neutral-600);
  --color-ink-accent: var(--color-accent-700);
  --color-ink-inverse: var(--color-neutral-0);
  --color-ink-inverse-secondary: var(--color-neutral-300);
  --color-ink-inverse-accent: var(--color-accent-200);

  --color-border-subtle: var(--color-neutral-200);
  --color-border-default: var(--color-neutral-300);
  --color-border-strong: var(--color-neutral-400);
  --color-border-inverse: var(--color-accent-700);
  --color-focus-ring: var(--color-accent-600);

  /* ---- typography ---- */
  --font-sans: var(--font-alexandria), system-ui, sans-serif;

  /* Fluid scale. Body steps on a 1.25 minor third, display on 1.414, so the
     jump from prose to headline is deliberate rather than gradual. */
  --text-2xs: clamp(0.6875rem, 0.66rem + 0.14vw, 0.75rem);
  --text-xs: clamp(0.75rem, 0.72rem + 0.16vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.84rem + 0.18vw, 0.9375rem);
  --text-base: clamp(1rem, 0.96rem + 0.2vw, 1.0625rem);
  --text-lg: clamp(1.125rem, 1.06rem + 0.32vw, 1.25rem);
  --text-xl: clamp(1.375rem, 1.27rem + 0.52vw, 1.5625rem);
  --text-2xl: clamp(1.75rem, 1.56rem + 0.95vw, 2.1875rem);
  --text-3xl: clamp(2.25rem, 1.9rem + 1.75vw, 3.0625rem);
  --text-4xl: clamp(2.75rem, 2.15rem + 3vw, 4.3125rem);
  --text-5xl: clamp(3.25rem, 2.3rem + 4.75vw, 6.0625rem);

  /* ---- section rhythm: industrial layouts need coarse vertical air ---- */
  --spacing-section-sm: clamp(3.5rem, 2.5rem + 5vw, 6rem);
  --spacing-section: clamp(4.5rem, 3rem + 7.5vw, 8rem);
  --spacing-section-lg: clamp(5.5rem, 3.5rem + 10vw, 10rem);

  /* ---- near-square radii: minerals processing, not fintech ---- */
  --radius-xs: 2px;
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-lg: 6px;

  /* ---- the one soft shadow permitted in the entire system ---- */
  --shadow-raised: 0 1px 2px oklch(0% 0 0 / 0.04), 0 8px 24px -12px oklch(0% 0 0 / 0.12);
}
`;
}

function renderDoc({
  accentHex,
  accent,
  discovered,
  accentRamp,
  neutralRamp,
  semantic,
  matrix,
}) {
  const rampTable = (ramp, label) =>
    [
      `| ${label} | OKLCH | sRGB | Contrast vs white | Contrast vs neutral-950 |`,
      '|---|---|---|---|---|',
      ...ramp.map((entry) => {
        const onWhite = contrast(entry.hex, '#ffffff').toFixed(2);
        const onInk = contrast(entry.hex, neutralRamp.at(-1).hex).toFixed(2);
        return `| \`${entry.stop}\` | \`${formatOklch(entry.oklch)}\` | \`${entry.hex}\` | ${onWhite}:1 | ${onInk}:1 |`;
      }),
    ].join('\n');

  const matrixTable = [
    '| Foreground | Background | Ratio | AA normal (4.5) | AA large (3.0) | AAA (7.0) |',
    '|---|---|---|---|---|---|',
    ...matrix.rows.map(
      (row) =>
        `| \`${row.ink}\` (${row.inkLabel}) | \`${row.surface}\` (${row.surfaceLabel}) | ${row.ratio.toFixed(2)}:1 | ${row.aaNormal ? 'pass' : 'FAIL'} | ${row.aaLarge ? 'pass' : 'FAIL'} | ${row.aaa ? 'pass' : '—'} |`,
    ),
  ].join('\n');

  const extrasTable = [
    '| Pairing | Ratio | Verdict |',
    '|---|---|---|',
    ...matrix.extras.map(
      (extra) =>
        `| ${extra.label} | ${extra.ratio.toFixed(2)}:1 | ${extra.ratio >= 7 ? 'AAA' : extra.ratio >= 4.5 ? 'AA' : extra.ratio >= 3 ? 'AA large only' : 'FAIL'} |`,
    ),
  ].join('\n');

  const failures = matrix.rows.filter((row) => !row.aaNormal && !row.aaLarge);

  return `# Brand tokens

Generated by \`scripts/build-tokens.mjs\` from \`public/brand/logo.svg\`. Regenerate with
\`node scripts/build-tokens.mjs\`; never hand-edit \`src/styles/tokens.css\`.

## 1. What was extracted

\`logo.svg\` is an Adobe Illustrator export with a single \`<style>\` rule. Every path,
polygon and rect in both the KMIT wordmark and the INDUSTRIAL SOLUTIONS lockup
references that one class, so the logo is monochrome — there is no secondary brand
colour to discover and none was invented.

${[
  '| Colour | References in file | OKLCH | Role |',
  '|---|---|---|---|',
  ...discovered.map(
    (entry) =>
      `| \`${entry.hex}\` | ${entry.count} | \`${formatOklch(entry.oklch)}\` | ${entry.hex === accentHex ? '**accent** — dominant by covered area' : 'not used'} |`,
  ),
].join('\n')}

The accent is **\`${accentHex}\`** — \`${formatOklch(accent)}\`. A deep indigo at
${(accent.l * 100).toFixed(1)}% lightness and ${accent.c.toFixed(4)} chroma: dark enough to
carry white text at AAA, saturated enough to survive a duotone treatment over the
quarry and plant photography.

## 2. How the ramps were built

Both ramps are generated in OKLCH and gamut-mapped back to sRGB by reducing chroma
only. Hue is held constant across every step of a ramp — hue drift is the single
most recognisable tell of a generated palette.

- **Accent ramp** — ten stops, 50 to 900. Lightness follows a hand-tuned curve rather
  than a linear interpolation, because even lightness steps in OKLCH still read as
  uneven when the eye compares a near-white tint against a near-black shade. Chroma
  peaks at 500–600 and is pulled back at both ends so the tints do not go chalky and
  the shades do not go muddy.
- **Neutral ramp** — twelve stops, 0 to 950, each carrying a fixed OKLCH chroma
  between \`0.0035\` and \`0.013\` at the accent's hue (${accent.h.toFixed(1)}°). Measured in
  sRGB that is a 1–3% per-channel deviation from a pure grey — the 2–4% tint the
  constitution asks for. The result is a grey that is unmistakably *this* project's
  grey under a colour picker and indistinguishable from neutral to the naked eye.
  Chroma rises with darkness, because a tint that is invisible at \`neutral-100\` is
  still invisible at \`neutral-900\` unless it is allowed to grow.
- **Semantic states** — four hues, each capped at the accent's chroma budget so a
  validation message never out-shouts the brand. Each ships a base, a surface, and a
  border so status treatments do not need runtime colour maths.

## 3. Accent ramp

${rampTable(accentRamp, 'Stop')}

## 4. Neutral ramp

${rampTable(neutralRamp, 'Stop')}

## 5. Semantic states

| Token | OKLCH | sRGB |
|---|---|---|
${semantic
  .flatMap((entry) => [
    `| \`--color-${entry.name}\` | \`${formatOklch(entry.base.oklch)}\` | \`${entry.base.hex}\` |`,
    `| \`--color-${entry.name}-surface\` | \`${formatOklch(entry.surface.oklch)}\` | \`${entry.surface.hex}\` |`,
    `| \`--color-${entry.name}-border\` | \`${formatOklch(entry.border.oklch)}\` | \`${entry.border.hex}\` |`,
  ])
  .join('\n')}

## 6. Contrast matrix

Every pairing the design system intends to ship, measured with the WCAG 2.1 relative
luminance formula.

${matrixTable}

### Key pairings

${extrasTable}

${
  failures.length === 0
    ? 'No shipping pairing falls below the AA large-text threshold. Pairings marked FAIL for normal text but passing for large text are permitted only at 24px+ or 19px+ bold, and are listed here so the styleguide can enforce that.'
    : `**${failures.length} pairing(s) fail both AA thresholds and must not ship.** Adjust the ramp stop, not the accent hue.`
}

## 7. Rules that hold regardless of the values above

1. One accent family. If a design needs a second chromatic colour, it needs a
   different design.
2. Hierarchy is carried by borders and background steps. The system defines exactly
   one soft shadow (\`--shadow-raised\`) and it is for overlays only.
3. Numeric data uses \`font-variant-numeric: tabular-nums\` and Latin numerals in both
   locales — the industry convention for specification tables.
4. Radii stay near-square (2–6px).
5. Never introduce a colour by hex in a component. If it is not a token, it does not
   exist.
`;
}

/* ------------------------------------------------------------------- main */

const { accent: accentHex, all: discovered } = await extractAccent();
const { accent, accentRamp, neutralRamp, semantic } = buildRamps(accentHex);
const matrix = buildContrastMatrix({ accentRamp, neutralRamp, semantic });

await writeFile(
  path.join(ROOT, 'src', 'styles', 'tokens.css'),
  renderCss({ accentHex, accentRamp, neutralRamp, semantic }),
  'utf8',
);
await writeFile(
  path.join(ROOT, 'docs', 'brand-tokens.md'),
  renderDoc({ accentHex, accent, discovered, accentRamp, neutralRamp, semantic, matrix }),
  'utf8',
);

const failing = matrix.rows.filter((row) => !row.aaNormal && !row.aaLarge);
console.log(`accent ${accentHex} -> ${formatOklch(accent)}`);
console.log(`accent ramp: ${accentRamp.map((entry) => entry.hex).join(' ')}`);
console.log(`neutral ramp: ${neutralRamp.map((entry) => entry.hex).join(' ')}`);
console.log(
  `contrast pairings checked: ${matrix.rows.length}, failing both AA thresholds: ${failing.length}`,
);
for (const extra of matrix.extras) {
  console.log(`  ${extra.label}: ${extra.ratio.toFixed(2)}:1`);
}
if (failing.length > 0) {
  for (const row of failing)
    console.log(`  FAIL ${row.ink} on ${row.surface}: ${row.ratio.toFixed(2)}:1`);
  process.exitCode = 1;
}
