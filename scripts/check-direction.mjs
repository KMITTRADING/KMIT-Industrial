/**
 * Physical-direction gate — the grep from CLAUDE.md §9, as a script.
 *
 * ESLint catches these while you type. This catches them in CI, in files ESLint
 * does not lint (CSS, MDX), and it is the check the constitution names, so it
 * runs exactly the pattern the constitution specifies rather than an
 * approximation of it.
 *
 * Exits non-zero and prints file:line for every hit.
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(import.meta.dirname, '..');
const SEARCH_ROOT = path.join(ROOT, 'src');

/** CLAUDE.md §9: `\b(ml|mr|pl|pr)-[0-9]|text-(left|right)|\b(left|right)-[0-9]` */
const PATTERN =
  /\b(ml|mr|pl|pr)-[0-9]|text-(left|right)\b|\b(left|right)-[0-9]|\b(border|rounded)-(l|r)-/;

/**
 * Lines that legitimately contain one of those substrings without being a
 * layout utility. Each entry must earn its place — this list is not a
 * convenience hatch.
 */
const ALLOWED = [
  // The gate's own pattern, and the rule that documents it.
  /check-direction\.mjs$/,
  /eslint\.config\.mjs$/,
];

const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.mdx', '.md']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

const files = await walk(SEARCH_ROOT);
const hits = [];

for (const file of files) {
  if (ALLOWED.some((pattern) => pattern.test(file))) continue;
  const source = await readFile(file, 'utf8');
  source.split('\n').forEach((line, index) => {
    if (PATTERN.test(line)) {
      hits.push({
        file: path.relative(ROOT, file),
        line: index + 1,
        text: line.trim(),
      });
    }
  });
}

if (hits.length > 0) {
  console.error(
    `check:direction failed — ${hits.length} physical-direction utility/utilities found.\n` +
      'Use logical properties: ms-*/me-*, ps-*/pe-*, start-*/end-*, text-start/text-end,\n' +
      'border-s-*/border-e-*, rounded-s-*/rounded-e-*. See CLAUDE.md §2.\n',
  );
  for (const hit of hits) {
    console.error(`  ${hit.file}:${hit.line}  ${hit.text}`);
  }
  process.exit(1);
}

console.log(
  `check:direction passed — ${files.length} files scanned, 0 physical-direction utilities.`,
);
