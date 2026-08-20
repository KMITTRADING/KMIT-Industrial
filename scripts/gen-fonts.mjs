/**
 * Alexandria is the only typeface on the site (brief §2), and §9 asks for the
 * weights actually used and nothing more.
 *
 * This pulls the two variable subsets we need straight from Google's CDN and
 * writes them into public/fonts, so the browser never opens a connection to a
 * third party and the stylesheet never blocks the critical path.
 *
 * The weight axis is 200-700. The files that were already in the repo carried
 * 400-700, which cannot render the light Latin weights the technical register
 * depends on (§6).
 *
 *   node scripts/gen-fonts.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API = 'https://fonts.googleapis.com/css2?family=Alexandria:wght@200..700&display=swap';

// Google serves a different file per script and keys them by a CSS comment.
// We want exactly two: the Arabic outlines and the Latin ones.
const WANTED = { arabic: 'alexandria-arabic-var.woff2', latin: 'alexandria-latin-var.woff2' };

// A browser UA is required, or the API answers with the legacy ttf payload.
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const css = await fetch(API, { headers: { 'User-Agent': UA } }).then((r) => {
  if (!r.ok) throw new Error(`font CSS request failed: ${r.status}`);
  return r.text();
});

// Each block is preceded by `/* subset */`, so the comment names the block that
// follows it. Split on the comments and keep the pairs.
const blocks = css.split(/\/\*\s*([a-z-]+)\s*\*\//i).slice(1);
const outDir = join(process.cwd(), 'public', 'fonts');
await mkdir(outDir, { recursive: true });

const ranges = {};
let written = 0;

for (let i = 0; i < blocks.length; i += 2) {
  const subset = blocks[i].trim();
  const body = blocks[i + 1] ?? '';
  const file = WANTED[subset];
  if (!file) continue;

  const url = body.match(/src:\s*url\(([^)]+)\)/)?.[1];
  const range = body.match(/unicode-range:\s*([^;]+);/)?.[1].replace(/\s+/g, ' ').trim();
  if (!url || !range) throw new Error(`could not parse the ${subset} block`);

  const bytes = Buffer.from(await fetch(url, { headers: { 'User-Agent': UA } }).then((r) => r.arrayBuffer()));
  await writeFile(join(outDir, file), bytes);
  ranges[subset] = range;
  written += 1;
  console.log(`${file}  ${(bytes.length / 1024).toFixed(1)} KB`);
}

if (written !== 2) throw new Error(`expected 2 subsets, wrote ${written}`);

// The unicode-ranges belong in type.css next to the @font-face rules. Print them
// rather than rewriting the stylesheet, so a change is a reviewed edit.
console.log('\nunicode-range values for styles/type.css:\n');
for (const [subset, range] of Object.entries(ranges)) console.log(`/* ${subset} */\n${range}\n`);
