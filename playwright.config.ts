import { defineConfig, devices } from '@playwright/test';

const port = 4321;
// BASE_URL points the tests at a deployed site (e.g. `pnpm test:smoke` after a deploy).
// Without it, Playwright builds the site and serves it locally.
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    // Most tests run as a visitor who has already made a cookie choice, so the banner stays out of the way.
    // tests/e2e/cookies.spec.ts clears it to test the banner itself.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: new URL(baseURL).origin,
          localStorage: [{ name: 'cookie-consent', value: 'necessary' }],
        },
      ],
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optional: point at a preinstalled Chromium instead of `playwright install`.
        launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
          ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
          : {},
      },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `pnpm build && PORT=${port} pnpm preview`,
        url: `http://localhost:${port}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
