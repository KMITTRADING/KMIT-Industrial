/**
 * The visual-overhaul acceptance list (§9), as assertions rather than opinions.
 *
 * These are the rules from the brief that can be measured from a rendered page.
 * The ones that cannot — "does this look organised", "does the solid read as
 * product photography" — are deliberately absent; a check that pretends to
 * measure taste is worse than no check.
 *
 * Usage: node scripts/check-visual.mjs [baseUrl]
 */
import { globSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const executablePath = globSync('/opt/pw-browsers/chromium-*/chrome-linux/chrome')[0];

const failures = [];
const pass = (msg) => console.log(`PASS  ${msg}`);
const fail = (msg) => {
  failures.push(msg);
  console.log(`FAIL  ${msg}`);
};

const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  args: ['--enable-unsafe-swiftshader'],
});

async function open(path, width = 1440) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  // The 3D path is what the rules are about, so the §10 gate is forced open.
  await page.addInitScript(() =>
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 })
  );
  await page.goto(`${BASE}${path}`, { waitUntil: 'load' });
  await page.waitForTimeout(3500);
  return { context, page };
}

/* ------------------------------------------------- §1 the colour ratio --- */
{
  const { context, page } = await open('/ar');
  const m = await page.evaluate(() => {
    const total = document.body.scrollHeight;
    const dark = [...document.querySelectorAll('.on-dark')];
    const rects = dark.map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY, h: r.height };
    });
    const darkHeight = rects.reduce((sum, r) => sum + r.h, 0);
    // Sections in the main flow only; the footer is a footer, not a section.
    const mainDark = [...document.querySelectorAll('main .on-dark')].length;
    // Adjacency: any two dark blocks whose edges meet within a pixel.
    rects.sort((a, b) => a.top - b.top);
    let adjacent = 0;
    for (let i = 1; i < rects.length; i++) {
      if (Math.abs(rects[i].top - rects[i - 1].bottom) < 2) adjacent++;
    }
    return { total, darkHeight, mainDark, adjacent };
  });

  const lightShare = 1 - m.darkHeight / m.total;
  if (lightShare >= 0.7) pass(`light sections are ${(lightShare * 100).toFixed(1)}% of the page (>= 70%)`);
  else fail(`light sections are only ${(lightShare * 100).toFixed(1)}% of the page, under the 70% floor`);

  if (m.mainDark === 2) pass('exactly two dark sections on the home page');
  else fail(`${m.mainDark} dark sections on the home page, the brief allows two`);

  if (m.adjacent === 0) pass('no two dark blocks are adjacent');
  else fail(`${m.adjacent} pair(s) of adjacent dark blocks`);

  /* §1: the large dark fields use --night, not the identity indigo. */
  const ground = await page.evaluate(() => {
    const el = document.querySelector('.on-dark');
    return el ? getComputedStyle(el).backgroundImage + getComputedStyle(el).backgroundColor : '';
  });
  if (/14,\s*16,\s*48|rgb\(14, 16, 48\)/.test(ground)) pass('dark fields use --night (#0E1030)');
  else fail(`dark fields do not use --night; computed ground was ${ground.slice(0, 90)}`);

  await context.close();
}

/* ------------------------------------------- §3 scenes are not in boxes --- */
{
  const { context, page } = await open('/ar');
  const boxed = await page.evaluate(() => {
    const holders = [...document.querySelectorAll('.scene-bleed, canvas')];
    const bad = [];
    for (const el of holders) {
      const cs = getComputedStyle(el);
      const problems = [];
      if (cs.borderTopWidth !== '0px' || cs.borderLeftWidth !== '0px') problems.push('border');
      if (parseFloat(cs.borderTopLeftRadius) > 0) problems.push('radius');
      if (cs.boxShadow !== 'none') problems.push('shadow');
      if (cs.overflow === 'hidden') problems.push('overflow:hidden');
      const bg = cs.backgroundColor;
      const transparent = bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent';
      if (!transparent) problems.push(`background ${bg}`);
      if (problems.length) bad.push(`${el.className || el.tagName}: ${problems.join(', ')}`);
    }
    return bad;
  });
  if (boxed.length === 0) pass('no scene holder carries a border, background, radius, shadow or clip');
  else for (const b of boxed) fail(`scene holder is boxed — ${b}`);

  const canvases = await page.evaluate(() => document.querySelectorAll('canvas').length);
  if (canvases === 1) pass('exactly one canvas, so exactly one WebGL context');
  else fail(`expected 1 canvas, found ${canvases}`);

  /*
   * §9: every scene must actually render in the section it belongs to. Scenes
   * are built near their own viewport, so each holder is scrolled to before it
   * is judged — asserting at the top of the page would only prove that
   * deferring works. The host stamps data-drawn on a holder the first time real
   * pixels land in it, so this is a statement about pixels, not about state.
   */
  const holderCount = await page.evaluate(
    () => document.querySelectorAll('.scene-bleed').length
  );
  const undrawn = [];
  for (let i = 0; i < holderCount; i++) {
    const label = await page.evaluate(async (index) => {
      const el = document.querySelectorAll('.scene-bleed')[index];
      el.scrollIntoView({ block: 'center' });
      return el.className;
    }, i);
    await page.waitForTimeout(2200);
    const ok = await page.evaluate(
      (index) => document.querySelectorAll('.scene-bleed')[index].dataset.drawn === 'true',
      i
    );
    if (!ok) undrawn.push(label);
  }
  if (holderCount === 0) fail('no scene holders found at all');
  else if (undrawn.length === 0) pass(`all ${holderCount} scene holder(s) actually drew`);
  else for (const u of undrawn) fail(`scene holder never drew: ${u}`);

  await context.close();
}

/* ------------------------------ §2 the header is legible over every section */
{
  const { context, page } = await open('/ar');
  const bad = await page.evaluate(async () => {
    const header = document.querySelector('.site-header');
    const out = [];
    const steps = 14;
    const max = document.body.scrollHeight - window.innerHeight;
    for (let i = 0; i <= steps; i++) {
      window.scrollTo(0, (max * i) / steps);
      // Longer than the header's own 300ms colour transition, so this reads
      // the settled colour rather than a frame part-way through it.
      await new Promise((r) => setTimeout(r, 520));
      const ground = getComputedStyle(header).getPropertyValue('--x');
      const state = header.dataset.ground;
      const colour = getComputedStyle(header).color;
      // White text is only legitimate when a dark ground was measured.
      const isWhite = /255,\s*255,\s*255/.test(colour);
      if (isWhite && state !== 'dark') {
        out.push(`white header text at scrollY ${Math.round(window.scrollY)} with ground="${state}"${ground}`);
      }
    }
    window.scrollTo(0, 0);
    return out;
  });
  if (bad.length === 0) pass('header never uses white text without a measured dark ground');
  else for (const b of bad) fail(b);
  await context.close();
}

/* ---------------------------------------- §6 no pin, no side scene < 1024 --- */
{
  const { context, page } = await open('/ar', 900);
  const m = await page.evaluate(() => ({
    pinSpacers: document.querySelectorAll('.pin-spacer').length,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  if (m.pinSpacers === 0) pass('no pinned section below 1024px');
  else fail(`${m.pinSpacers} pinned section(s) below 1024px`);
  if (m.overflowX <= 0) pass('no horizontal overflow at 900px');
  else fail(`horizontal overflow of ${m.overflowX}px at 900px`);
  await context.close();
}

/* ------------------------------------ §8 one pin on the home page, desktop --- */
{
  const { context, page } = await open('/ar', 1440);
  const pins = await page.evaluate(() => document.querySelectorAll('.pin-spacer').length);
  if (pins <= 1) pass(`${pins} pinned section on the home page (max 1)`);
  else fail(`${pins} pinned sections on the home page, the brief allows one`);
  await context.close();
}

await browser.close();

console.log('');
if (failures.length) {
  console.log(`${failures.length} visual acceptance failure(s).`);
  process.exit(1);
}
console.log('Visual acceptance list clean.');
