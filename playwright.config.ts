import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end configuration.
 *
 * Runs against a production build rather than the dev server: the RTL layout,
 * the static rendering and the client bundle are all different in development,
 * and a green suite against `next dev` says little about what ships.
 *
 * One browser here, and that is a stated limitation rather than a choice.
 * Chromium is the only engine available in this environment. Safari on macOS
 * and iOS in particular renders Arabic text and RTL layout differently enough
 * that it needs a real run before launch; docs/qa-report.md records what has
 * and has not been exercised.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3100',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    /*
      Use the Chromium already on the machine rather than downloading a build
      matched to this @playwright/test version. `PLAYWRIGHT_CHROMIUM_PATH` lets
      CI or another environment point somewhere else without editing this file.
    */
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium',
    },
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      /** 390px is the iPhone class width and the narrowest the design targets. */
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 } },
    },
  ],

  webServer: {
    command: 'npm run start -- -p 3100',
    url: 'http://localhost:3100/ar',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
