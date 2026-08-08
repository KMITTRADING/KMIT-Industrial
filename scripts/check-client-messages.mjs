/**
 * Client message-scope gate.
 *
 * `src/i18n/client-messages.ts` narrows what is serialised into the RSC payload
 * from the whole catalogue to the eight namespaces client components actually
 * read. That saves 47 KB per document and costs a class of runtime error: a
 * client component reading a namespace outside the list throws where it renders,
 * and only on the route that renders it.
 *
 * So the list is checked rather than trusted. Every `'use client'` module is
 * scanned for the namespaces it reads, through either form:
 *
 *     useTranslations('nav')      -> nav
 *     const t = useTranslations() -> t('ui.close') -> ui
 *
 * and any namespace not in `CLIENT_NAMESPACES` fails the build. The reverse is
 * reported too: a namespace in the list that nothing reads is 100 to 7000 bytes
 * shipped to every visitor for nothing.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const LIST = path.join(SRC, 'i18n', 'client-messages.ts');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) files.push(full);
  }
  return files;
}

/* ------------------------------------------------- the declared allowlist */

const listSource = await readFile(LIST, 'utf8');

/**
 * Every quoted name in a list body, whether the list is written one entry per
 * line or inline. Comments are stripped first so a namespace mentioned in a
 * docblock is not mistaken for a declared one.
 */
function namespacesIn(source) {
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  return [...withoutComments.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

const baseBlock = listSource.match(/BASE_NAMESPACES = \[([\s\S]*?)\] as const/);
const routeBlock = listSource.match(/ROUTE_NAMESPACES = \{([\s\S]*?)\n\} as const/);
if (!baseBlock || !routeBlock) {
  console.error('check:client-messages failed: could not read the namespace lists');
  process.exit(1);
}

const base = new Set(namespacesIn(baseBlock[1]));

/** bucket path prefix -> extra namespaces */
const buckets = new Map();
for (const match of routeBlock[1].matchAll(/'([^']+)':\s*\[([\s\S]*?)\]/g)) {
  buckets.set(match[1], new Set(namespacesIn(match[2])));
}

/** Everything a file at this path is allowed to read. */
function allowedFor(relative) {
  const allowed = new Set(base);
  for (const [prefix, extra] of buckets) {
    if (relative.includes(prefix)) for (const namespace of extra) allowed.add(namespace);
  }
  return allowed;
}

/* --------------------------------------------------------- what is used */

/** file -> namespaces it reads */
const used = new Map();
const record = (namespace, file) => {
  const relative = path.relative(ROOT, file);
  if (!used.has(relative)) used.set(relative, new Set());
  used.get(relative).add(namespace);
};

for (const file of await walk(SRC)) {
  const source = await readFile(file, 'utf8');
  if (!source.trimStart().startsWith("'use client'")) continue;

  // Scoped: useTranslations('nav')
  for (const match of source.matchAll(/useTranslations\(\s*'([^']+)'\s*\)/g)) {
    record(match[1].split('.')[0], file);
  }

  // Unscoped: useTranslations() then t('ui.close') or t(`nav.${x}`)
  if (/useTranslations\(\s*\)/.test(source)) {
    for (const match of source.matchAll(/\bt\(\s*['`]([A-Za-z][A-Za-z0-9]*)\./g)) {
      record(match[1], file);
    }
  }
}

/* ------------------------------------------------------------- reconcile */

const findings = [];
const everyUsed = new Set();

for (const [relative, namespaces] of used) {
  const allowed = allowedFor(relative);
  for (const namespace of namespaces) {
    everyUsed.add(namespace);
    if (!allowed.has(namespace)) {
      findings.push({
        rule: 'missing',
        detail: `${relative} reads "${namespace}", which neither BASE_NAMESPACES nor its route bucket provides`,
      });
    }
  }
}

for (const namespace of base) {
  if (!everyUsed.has(namespace)) {
    findings.push({
      rule: 'unused',
      detail: `"${namespace}" is in BASE_NAMESPACES but no client component reads it`,
    });
  }
}

if (findings.length > 0) {
  console.error(`check:client-messages found ${findings.length} problem(s):\n`);
  for (const finding of findings) console.error(`  [${finding.rule}] ${finding.detail}`);
  console.error(
    '\nAdd the namespace to BASE_NAMESPACES or to its ROUTE_NAMESPACES bucket, or\n' +
      'move the string to a server component.',
  );
  process.exit(1);
}

const routeTotal = [...buckets.values()].reduce((sum, set) => sum + set.size, 0);
console.log(
  `check:client-messages passed - ${base.size} base namespaces, ${routeTotal} across ${buckets.size} route buckets, all reads covered.`,
);
