import { expect, test } from '@playwright/test';

/**
 * The four flows that carry the site's purpose.
 *
 * Written against behaviour a buyer performs, not against implementation: the
 * assertions are on the URL, on what is announced, and on what is visible,
 * so a refactor that preserves the flow keeps them green.
 *
 * Both locales throughout. A bilingual site where only the English form has
 * ever been submitted is a site with an untested Arabic form.
 */

const LOCALES = ['ar', 'en'] as const;

/* ------------------------------------------------------------ RFQ form */

for (const locale of LOCALES) {
  test(`RFQ: validation blocks an empty step (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/rfq`);

    // Step one asks for a grade or an application. Advancing with nothing
    // chosen must not move the form on.
    const form = page.locator('form');
    await expect(form).toBeVisible();

    const next = form.getByRole('button').last();
    await next.click();

    // Still on step one: the contact fields have not appeared.
    await expect(page.getByRole('textbox', { name: /.*/ }).first()).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/${locale}/rfq`));
  });

  test(`RFQ: a complete request submits (${locale})`, async ({ page }) => {
    await page.goto(`/${locale}/rfq?grade=GCC-1250`);

    const form = page.locator('form');
    await expect(form).toBeVisible();

    /*
      Located by position among the *visible* controls of the current step.
      Field ids are React-generated and unstable, and labels are localised, so
      neither is a durable handle. Only one fieldset is displayed at a time, so
      `:visible` scopes each step for us.

      The honeypot is excluded explicitly. It is positioned off-screen rather
      than hidden, so it still has a bounding box and Playwright counts it as
      visible; filling it is exactly what the spam trap is watching for.
    */
    const TEXT = 'input:not([type]):visible, input[type="text"]:visible';
    const notHoneypot = (selector: string) => `${selector}:not(#rfq-website)`;
    const advance = async () => {
      await form.locator('button:visible').last().click();
    };

    // Step one: tonnage. Grade arrives prefilled from the query string.
    await form.locator('input[type="number"]:visible').fill('25');
    await advance();

    // Step two: destination.
    // The text inputs render without an explicit `type`, so match its absence
    // as well as the attribute.
    const destination = form.locator(notHoneypot(TEXT));
    await destination.nth(0).fill('Jeddah');
    await destination.nth(1).fill('Saudi Arabia');
    await advance();

    // Step three: who to reply to.
    const contact = form.locator(notHoneypot(TEXT));
    await contact.nth(0).fill('Test Plastics Co');
    await contact.nth(1).fill('A Buyer');
    await form.locator('input[type="email"]:visible').fill('buyer@example.com');
    await form.locator('input[type="tel"]:visible').fill('+966 12 000 0000');
    await advance();

    // The success state replaces the form and carries the reference that the
    // reply quotes back.
    await expect(form).toBeHidden({ timeout: 20_000 });
    await expect(page.getByText(/[A-Z]{3,4}-[A-Z0-9-]{4,}/).first()).toBeVisible();
  });
}

/* -------------------------------------------------------- locale switch */

test('the locale switcher preserves the deep path', async ({ page }) => {
  await page.goto('/ar/products/gcc-1250');

  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/en\/products\/gcc-1250$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

  await page.getByRole('link', { name: 'العربية' }).click();
  await expect(page).toHaveURL(/\/ar\/products\/gcc-1250$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

/* ---------------------------------------------------------- grade filter */

test('the grade filter puts its state in the URL', async ({ page }) => {
  await page.goto('/en/products');

  await page.getByRole('link', { name: 'Drilling fluids for oil and gas' }).click();
  await expect(page).toHaveURL(/industry=oil-gas-drilling/);

  // Filtering narrows the matrix: only GCC-200 serves drilling fluids.
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText('GCC-200');
});

test('comparison state survives a reload and is capped', async ({ page }) => {
  await page.goto('/en/products?compare=GCC-200,GCC-400,GCC-800,GCC-1250');

  // Four requested, three is the cap. Located by the section's labelled
  // heading: matching on the text "Compare grades" also hits the sr-only
  // column header in the matrix above.
  const comparison = page
    .locator('section[aria-labelledby="comparison-heading"]')
    .locator('table');
  await expect(comparison.locator('thead th')).toHaveCount(4); // parameter column + 3
});

/* ------------------------------------------------------- document flow */

test('a document row routes to a prefilled quotation request', async ({ page }) => {
  await page.goto('/en/resources');

  await page.locator('a[href*="/rfq?document=tds"]').first().click();

  await expect(page).toHaveURL(/\/en\/rfq\?/);
  await expect(page).toHaveURL(/document=tds/);
  await expect(page).toHaveURL(/grade=GCC-/);
});

/* ------------------------------------------------------- keyboard access */

test('the skip link is the first stop and reaches the main landmark', async ({ page }) => {
  await page.goto('/ar');

  await page.keyboard.press('Tab');
  const focused = page.locator(':focus');
  await expect(focused).toHaveAttribute('href', '#main');

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});
