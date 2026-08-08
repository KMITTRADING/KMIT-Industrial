/**
 * Accessibility audit over the rendered pages.
 *
 * Runs the WCAG 2.1 AA checks that can be made against static markup, on the
 * real server output rather than on source. The two things this catches that a
 * source review does not: a component that renders differently once composed,
 * and a page that ships two `h1` elements because two components each thought
 * they owned the page heading.
 *
 * Colour contrast is not checked here. It is checked exhaustively, on the token
 * pairings themselves, by scripts/build-tokens.mjs, and the result is published
 * in docs/brand-tokens.md.
 *
 * Usage:
 *   npm run build && npx next start -p 3123 &
 *   node scripts/audit-a11y.mjs http://localhost:3123
 */

import process from 'node:process';
import { parse } from 'node-html-parser';

const ORIGIN = process.argv[2] ?? 'http://localhost:3000';
/**
 * Every route in the tree, in both locales. Parameterised routes are audited
 * through one representative: the grade pages differ only in their numbers and
 * the sector pages only in their copy, so a second instance of either would
 * exercise the same markup twice.
 */
const PATHS = [
  '',
  '/products',
  '/products/gcc-1250',
  '/applications',
  '/applications/plastics-masterbatch',
  '/sustainability-and-facility',
  '/resources',
  '/contact',
  '/rfq',
  '/styleguide',
];

const ROUTES = ['/ar', '/en'].flatMap((locale) => PATHS.map((path) => `${locale}${path}`));

const findings = [];

function report(route, rule, detail) {
  findings.push({ route, rule, detail });
}

const textOf = (node) => (node.text ?? '').replace(/\s+/g, ' ').trim();

/** An element has an accessible name if it has text, a label, or a title. */
function hasAccessibleName(node) {
  if (textOf(node).length > 0) return true;
  if (node.getAttribute('aria-label')) return true;
  if (node.getAttribute('aria-labelledby')) return true;
  if (node.getAttribute('title')) return true;
  // An image child with alt text names its parent.
  return node.querySelectorAll('img').some((img) => (img.getAttribute('alt') ?? '').length > 0);
}

function auditDocument(route, html) {
  const root = parse(html);

  /* ---------------------------------------------------- document level */

  const htmlEl = root.querySelector('html');
  if (!htmlEl?.getAttribute('lang')) report(route, 'html-lang', 'missing lang on <html>');
  if (!htmlEl?.getAttribute('dir')) report(route, 'html-dir', 'missing dir on <html>');

  const h1s = root.querySelectorAll('h1');
  if (h1s.length === 0) report(route, 'one-h1', 'no h1 on the page');
  if (h1s.length > 1) report(route, 'one-h1', `${h1s.length} h1 elements`);

  /* ------------------------------------------------- heading hierarchy */

  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previous = 0;
  for (const heading of headings) {
    const level = Number(heading.rawTagName.slice(1));
    if (previous > 0 && level > previous + 1) {
      report(
        route,
        'heading-order',
        `h${previous} followed by h${level}: "${textOf(heading).slice(0, 48)}"`,
      );
    }
    previous = level;
  }

  /* -------------------------------------------------------- landmarks */

  if (root.querySelectorAll('main').length !== 1) {
    report(route, 'main-landmark', `${root.querySelectorAll('main').length} main elements`);
  }
  const skip = root.querySelectorAll('a.skip-link');
  if (skip.length !== 1) report(route, 'skip-link', `${skip.length} skip links (expected 1)`);
  if (skip[0] && !root.querySelector(`#${skip[0].getAttribute('href')?.slice(1)}`)) {
    report(route, 'skip-link', 'skip link target does not exist');
  }

  /* ------------------------------------------------------------ images */

  for (const img of root.querySelectorAll('img')) {
    const alt = img.getAttribute('alt');
    if (alt === null || alt === undefined) {
      report(route, 'img-alt', `img without alt: ${img.getAttribute('src')?.slice(0, 60)}`);
    }
    if (!img.getAttribute('width') || !img.getAttribute('height')) {
      // An intrinsically sized image causes layout shift, which is a launch gate.
      report(
        route,
        'img-dimensions',
        `img without dimensions: ${img.getAttribute('src')?.slice(0, 60)}`,
      );
    }
  }

  /* ------------------------------------------------------------ inputs */

  const labelFor = new Set(
    root.querySelectorAll('label[for]').map((label) => label.getAttribute('for')),
  );

  /**
   * A control nested inside a `<label>` is labelled by that label's text, with
   * no `for`/`id` pair involved. HTML calls this an implicit label and it is
   * exactly what the checkbox chips in the RFQ form use, so an auditor that
   * only understands `label[for]` reports them all as unlabelled.
   */
  function implicitlyLabelled(control) {
    for (let node = control.parentNode; node; node = node.parentNode) {
      if (node.rawTagName === 'label') return textOf(node).length > 0;
    }
    return false;
  }

  for (const control of root.querySelectorAll('input, select, textarea')) {
    const type = control.getAttribute('type');
    if (type === 'hidden') continue;
    const id = control.getAttribute('id');
    const named =
      (id && labelFor.has(id)) ||
      control.getAttribute('aria-label') ||
      control.getAttribute('aria-labelledby') ||
      control.getAttribute('title') ||
      implicitlyLabelled(control);
    if (!named) {
      report(
        route,
        'control-label',
        `${control.rawTagName} without a label (id=${id ?? 'none'})`,
      );
    }
  }

  /* --------------------------------------------------------- controls */

  for (const button of root.querySelectorAll('button')) {
    if (!hasAccessibleName(button)) {
      report(
        route,
        'button-name',
        `button without an accessible name: ${button.toString().slice(0, 90)}`,
      );
    }
  }

  for (const anchor of root.querySelectorAll('a')) {
    if (!anchor.getAttribute('href')) {
      report(route, 'link-href', 'anchor without href');
      continue;
    }
    if (!hasAccessibleName(anchor)) {
      report(
        route,
        'link-name',
        `link without an accessible name: ${anchor.getAttribute('href')}`,
      );
    }
  }

  /* ----------------------------------------------------------- tables */

  for (const table of root.querySelectorAll('table')) {
    if (!table.querySelector('caption')) {
      report(route, 'table-caption', 'table without a caption');
    }
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      report(route, 'table-headers', 'table without header cells');
    }
    for (const header of headers) {
      if (!header.getAttribute('scope')) {
        report(route, 'th-scope', `th without scope: "${textOf(header).slice(0, 40)}"`);
      }
    }
  }

  /* ------------------------------------------------------------- aria */

  for (const node of root.querySelectorAll('[aria-controls]')) {
    const target = node.getAttribute('aria-controls');
    // A collapsed disclosure legitimately has no target in the DOM yet; only
    // flag the case where the control claims to be expanded.
    if (
      node.getAttribute('aria-expanded') === 'true' &&
      target &&
      !root.querySelector(`#${target}`)
    ) {
      report(route, 'aria-controls', `aria-controls="${target}" has no target while expanded`);
    }
  }

  for (const node of root.querySelectorAll('[tabindex]')) {
    const value = Number(node.getAttribute('tabindex'));
    if (value > 0) {
      report(route, 'tabindex', `positive tabindex=${value} breaks the natural tab order`);
    }
  }

  for (const node of root.querySelectorAll('[role="tab"]')) {
    if (!node.getAttribute('aria-selected')) {
      report(route, 'tab-selected', 'role="tab" without aria-selected');
    }
    if (!node.getAttribute('aria-controls')) {
      report(route, 'tab-controls', 'role="tab" without aria-controls');
    }
  }
}

/* -------------------------------------------------------------------- run */

let checked = 0;
for (const route of ROUTES) {
  const response = await fetch(`${ORIGIN}${route}`);
  if (!response.ok) {
    report(route, 'fetch', `HTTP ${response.status}`);
    continue;
  }
  auditDocument(route, await response.text());
  checked += 1;
}

if (findings.length > 0) {
  console.error(`audit:a11y found ${findings.length} problem(s) across ${checked} route(s):\n`);
  const byRule = new Map();
  for (const finding of findings) {
    byRule.set(finding.rule, [...(byRule.get(finding.rule) ?? []), finding]);
  }
  for (const [rule, entries] of byRule) {
    console.error(`  [${rule}] ${entries.length}`);
    for (const entry of entries.slice(0, 6)) {
      console.error(`      ${entry.route}: ${entry.detail}`);
    }
    if (entries.length > 6) console.error(`      ... and ${entries.length - 6} more`);
  }
  process.exit(1);
}

console.log(`audit:a11y passed - ${checked} routes, 0 problems.`);
