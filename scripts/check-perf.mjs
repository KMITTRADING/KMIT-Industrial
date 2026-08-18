/**
 * Vitals on both paths, under Slow 4G and 4x CPU throttling.
 *
 * Why this exists: §10 sends any machine reporting `hardwareConcurrency <= 4`
 * down the static path, and the build container reports four. Every performance
 * number taken here without forcing the gate therefore described a page with no
 * three.js on it at all — while a headless Lighthouse runner, which has more
 * cores and no GPU, measured the WebGL path and scored it 20 points lower. The
 * regression was invisible locally purely because nothing measured that path.
 *
 * So this measures both, and fails if the WebGL path blocks the main thread for
 * longer than a budget. The budget is on the *worst single task*, not the total:
 * total blocking time is what Lighthouse scores, but one long task is what a
 * visitor actually feels as a frozen page.
 *
 * Usage: node scripts/check-perf.mjs [baseUrl]
 */
import { globSync } from 'node:fs';
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';

/** Generous enough not to be flaky on a shared runner, tight enough to catch a
 *  multi-second block. The measured worst task is ~290ms. */
const WORST_TASK_BUDGET_MS = 1200;
const RUNS = 2;

const executablePath = globSync('/opt/pw-browsers/chromium-*/chrome-linux/chrome')[0];

async function measure(browser, { locale, gateOpen }) {
  const context = await browser.newContext({ viewport: { width: 1350, height: 940 } });
  const page = await context.newPage();

  if (gateOpen) {
    // Report more cores than the §10 gate's threshold so the 3D path runs.
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
    });
  }

  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  await page.goto(`${BASE}/${locale}`, { waitUntil: 'load' });
  // Long enough for the idle-scheduled scenes to have been built.
  await page.waitForTimeout(9000);

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const out = {
          lcp: 0,
          lcpEl: '',
          cls: 0,
          longTasks: 0,
          longTaskMs: 0,
          worst: 0,
          canvases: document.querySelectorAll('canvas').length,
        };
        new PerformanceObserver((list) => {
          const entry = list.getEntries().at(-1);
          out.lcp = Math.round(entry.startTime);
          out.lcpEl = entry.element
            ? `${entry.element.tagName.toLowerCase()}.${String(entry.element.className || '').split(' ')[0]}`
            : entry.url || '?';
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) if (!entry.hadRecentInput) out.cls += entry.value;
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            out.longTasks++;
            out.longTaskMs += entry.duration;
            out.worst = Math.max(out.worst, Math.round(entry.duration));
          }
        }).observe({ type: 'longtask', buffered: true });
        setTimeout(() => {
          out.cls = Number(out.cls.toFixed(4));
          out.longTaskMs = Math.round(out.longTaskMs);
          resolve(out);
        }, 900);
      })
  );

  await context.close();
  return vitals;
}

const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
  // No GPU here, so WebGL falls back to SwiftShader — which is also what a
  // headless Lighthouse runner does. That is the point: it is the slow case.
  args: ['--enable-unsafe-swiftshader'],
});

let failures = 0;
const report = (label, v) => {
  console.log(
    `  ${label.padEnd(22)} LCP ${String(v.lcp).padStart(4)}ms  CLS ${String(v.cls).padEnd(6)}` +
      `  long tasks ${String(v.longTaskMs).padStart(5)}ms (worst ${String(v.worst).padStart(4)}ms)` +
      `  canvases ${v.canvases}  <- ${v.lcpEl}`
  );
};

console.log(`\nStatic path (§10 gate shut) — ${BASE}`);
for (const locale of ['ar', 'en']) {
  report(locale, await measure(browser, { locale, gateOpen: false }));
}

console.log('\nWebGL path (§10 gate forced open)');
let worstSeen = 0;
for (let run = 1; run <= RUNS; run++) {
  const v = await measure(browser, { locale: 'ar', gateOpen: true });
  report(`ar run ${run}`, v);
  worstSeen = Math.max(worstSeen, v.worst);
  if (v.canvases !== 1) {
    console.log(`FAIL  expected exactly 1 canvas with the gate open, found ${v.canvases}`);
    failures++;
  }
}

console.log('');
if (worstSeen > WORST_TASK_BUDGET_MS) {
  console.log(
    `FAIL  worst main-thread task on the WebGL path is ${worstSeen}ms, over the ${WORST_TASK_BUDGET_MS}ms budget`
  );
  failures++;
} else {
  console.log(
    `PASS  worst main-thread task on the WebGL path is ${worstSeen}ms, within the ${WORST_TASK_BUDGET_MS}ms budget`
  );
}

await browser.close();
if (failures > 0) process.exit(1);
console.log('\nPerformance within budget on both paths.');
