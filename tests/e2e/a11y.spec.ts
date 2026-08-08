import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * WCAG 2.1 AA, on every route, in both locales and therefore both directions.
 *
 * `scripts/audit-a11y.mjs` reads static markup and catches structural faults.
 * This runs the real axe-core engine in a real browser against the rendered,
 * hydrated page, which is where colour contrast, ARIA relationships and
 * computed accessible names are actually decidable.
 *
 * Both are kept. The static audit runs in a second and catches the common
 * regressions; this one is slower, needs a browser, and is the authority.
 */

const PATHS = [
  '',
  '/products',
  '/products/gcc-1250',
  '/applications',
  '/applications/plastics-masterbatch',
  '/guides',
  '/guides/grade-selection',
  '/guides/coated-vs-uncoated',
  '/guides/gcc-vs-pcc',
  '/sustainability-and-facility',
  '/resources',
  '/contact',
  '/rfq',
] as const;

const LOCALES = ['ar', 'en'] as const;

for (const locale of LOCALES) {
  for (const path of PATHS) {
    const route = `/${locale}${path}`;

    test(`axe: ${route}`, async ({ page }) => {
      await page.goto(route);
      // `networkidle` is flaky against a streaming response. The main landmark
      // being present is the condition that actually matters here.
      await page.locator('main#main').waitFor({ state: 'attached' });

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // The message names the rule and the element, so a failure is actionable
      // from the CI log without reproducing it locally first.
      const summary = results.violations
        .map(
          (violation) =>
            `${violation.id} (${violation.impact}): ${violation.help}\n` +
            violation.nodes.map((node) => `    ${node.target.join(' ')}`).join('\n'),
        )
        .join('\n');

      expect(summary, `axe violations on ${route}`).toBe('');
    });
  }
}

test('the document direction follows the locale', async ({ page }) => {
  await page.goto('/ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar-SA');

  await page.goto('/en');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
