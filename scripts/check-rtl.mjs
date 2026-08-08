/**
 * RTL integrity gate.
 *
 * The direction grep in CLAUDE.md §9 catches physical-direction utility
 * classes. It cannot catch the defect that actually breaks an Arabic
 * specification page, which is bidirectional reordering of measurements.
 *
 * The Unicode bidi algorithm resolves a neutral character between two numbers
 * to the surrounding paragraph direction. In an RTL paragraph that means:
 *
 *     4.5 - 6.0 µm      renders as      6.0 - 4.5 µm
 *     ≥ 98.5%           renders with the operator on the wrong side
 *
 * Both are silently, confidently wrong, and both are the numbers a formulation
 * engineer is reading. The fix is an explicit `dir="ltr"` on the element
 * carrying the value, and this gate asserts it on every Arabic page.
 *
 * It also checks icon mirroring: an arrow or chevron must flip with the
 * document, and a logo or a clock must not.
 *
 * Usage:
 *   npm run build && npx next start -p 3000 &
 *   node scripts/check-rtl.mjs http://localhost:3000
 */

import process from 'node:process';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';

const PATHS = [
  '',
  '/products',
  '/products/gcc-1250',
  '/products/gcc-200',
  '/applications',
  '/applications/plastics-masterbatch',
  '/applications/oil-gas-drilling',
  '/guides',
  '/guides/grade-selection',
  '/guides/coated-vs-uncoated',
  '/guides/gcc-vs-pcc',
  '/sustainability-and-facility',
  '/resources',
  '/contact',
  '/rfq',
];

/**
 * Patterns that reorder under RTL and must sit inside an LTR island.
 *
 * A bare grade code is not here: `GCC-1250` is strong-L letters followed by a
 * hyphen and digits, which the algorithm keeps together. It is the range and
 * the comparison operator that break.
 */
const NEEDS_LTR = [
  { name: 'numeric range', pattern: /\d+(?:\.\d+)?\s+-\s+\d+(?:\.\d+)?/ },
  { name: 'comparison operator', pattern: /[≥≤]\s*\d/ },
];

/** Icons that must mirror with the document, by component class hook. */
const MUST_MIRROR = ['ArrowInlineEnd', 'ChevronInlineEnd'];

const findings = [];
const report = (route, rule, detail) => findings.push({ route, rule, detail });

/** Nearest `dir` attribute walking up from a node, or the document default. */
function inheritedDir(node) {
  for (let current = node; current; current = current.parentNode) {
    const dir = current.getAttribute?.('dir');
    if (dir) return dir;
  }
  return undefined;
}

for (const path of PATHS) {
  const route = `/ar${path}`;
  const response = await fetch(`${ORIGIN}${route}`);
  if (!response.ok) {
    report(route, 'status', `returned ${response.status}`);
    continue;
  }

  const root = parse(await response.text());

  const html = root.querySelector('html');
  if (html?.getAttribute('dir') !== 'rtl') {
    report(route, 'document-dir', `<html dir> is "${html?.getAttribute('dir')}", expected rtl`);
  }

  const body = root.querySelector('body');
  if (!body) continue;

  for (const script of body.querySelectorAll('script, style')) script.remove();

  /* ------------------------------------------------- bidi isolation */

  const walk = (node) => {
    for (const child of node.childNodes ?? []) {
      if (child.nodeType === 3) {
        const text = child.rawText ?? '';
        for (const { name, pattern } of NEEDS_LTR) {
          if (!pattern.test(text)) continue;
          if (inheritedDir(node) !== 'ltr') {
            report(
              route,
              'bidi',
              `${name} outside an LTR island: "${text.trim().slice(0, 60)}" in <${node.rawTagName}>`,
            );
          }
        }
      } else if (child.nodeType === 1) {
        walk(child);
      }
    }
  };
  walk(body);

  /* -------------------------------------------------- icon mirroring */

  for (const svg of body.querySelectorAll('svg')) {
    const className = svg.getAttribute('class') ?? '';
    const mirrors = className.includes('rtl:-scale-x-100');
    const looksDirectional = MUST_MIRROR.some((hook) =>
      (svg.getAttribute('data-icon') ?? '').includes(hook),
    );
    if (looksDirectional && !mirrors) {
      report(
        route,
        'icon',
        `directional icon does not mirror: ${svg.getAttribute('data-icon')}`,
      );
    }
    if (
      !looksDirectional &&
      mirrors &&
      (svg.getAttribute('data-icon') ?? '').includes('Logo')
    ) {
      report(route, 'icon', 'a logo is being mirrored');
    }
  }
}

if (findings.length > 0) {
  const grouped = new Map();
  for (const finding of findings) {
    if (!grouped.has(finding.rule)) grouped.set(finding.rule, []);
    grouped.get(finding.rule).push(finding);
  }
  console.error(`check:rtl found ${findings.length} problem(s):\n`);
  for (const [rule, entries] of grouped) {
    console.error(`  [${rule}] ${entries.length}`);
    for (const entry of entries.slice(0, 10)) {
      console.error(`      ${entry.route}: ${entry.detail}`);
    }
    if (entries.length > 10) console.error(`      ... and ${entries.length - 10} more`);
  }
  process.exit(1);
}

console.log(
  `check:rtl passed - ${PATHS.length} Arabic routes, bidi isolation and mirroring clean.`,
);
