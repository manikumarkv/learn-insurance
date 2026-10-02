import { defineConfig, devices } from '@playwright/test';

const port = 4321;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    // Most tests run as a visitor who has already made a cookie choice, so the banner stays out of the way.
    // tests/e2e/cookies.spec.ts clears it to test the banner itself.
    storageState: {
      cookies: [],
      origins: [
        {
          origin: `http://localhost:${port}`,
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
  webServer: {
    command: `pnpm build && pnpm preview --port ${port} --ignore-lock`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
