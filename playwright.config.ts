import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config — tests run against a local Astro dev server by
 * default. The dev server doesn't run the worker code, so any spec that
 * exercises /api/chat-send mocks it via `page.route()`. Auth-gate specs
 * hit the deployed URL through the `request` fixture (basic-auth at the
 * HTTP layer, not a page).
 *
 * Two ports: 4321 is Astro's default. Override with E2E_BASE_URL to point
 * the suite at a deployed worker (with E2E_BASIC_AUTH_USER/PASS).
 */
const LOCAL_PORT = 4321;
const LOCAL_BASE = `http://localhost:${LOCAL_PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "line" : "list",

  use: {
    baseURL: process.env.E2E_BASE_URL ?? LOCAL_BASE,
    httpCredentials:
      process.env.E2E_BASIC_AUTH_USER && process.env.E2E_BASIC_AUTH_PASS
        ? {
            username: process.env.E2E_BASIC_AUTH_USER,
            password: process.env.E2E_BASIC_AUTH_PASS,
          }
        : undefined,
    trace: "on-first-retry",
    navigationTimeout: 30_000,
    actionTimeout: 10_000,
  },
  timeout: 60_000,

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm run dev -- --host 127.0.0.1",
        url: LOCAL_BASE,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
