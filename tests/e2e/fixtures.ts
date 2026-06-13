import { test as base, type Page } from "@playwright/test";

/**
 * Shared helpers for the E2E suite.
 *
 *   mockChatSendOk    — succeeds; returns a synthetic transcript with
 *                       a single assistant turn echoing the prompt.
 *   mockChatSendQuota — returns 402 quota_exhausted (the SignupCTA path).
 *   mockChatSendError — returns 502 upstream_error.
 *
 * Tests can also call `enterValidEmail()` to clear the email gate
 * without retyping in each spec.
 */

export interface MockChatOptions {
  reply?: string;
  delayMs?: number;
  /**
   * Optional medical-safety advisory attached to the assistant turn,
   * mirroring the server-side medicalSafety check payload.
   */
  safetyAdvisory?: {
    severity: "review" | "severe";
    text: string;
    categories?: string[];
  };
}

export async function mockChatSendOk(
  page: Page,
  options: MockChatOptions = {},
) {
  const { reply = "Synthetic AI reply from mock.", delayMs = 0, safetyAdvisory } = options;
  await page.route("**/api/chat-send", async (route) => {
    if (delayMs) await new Promise((r) => setTimeout(r, delayMs));
    const body = JSON.parse(route.request().postData() ?? "{}") as {
      newPrompt?: string;
    };
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        transcript: [
          {
            prompt: body.newPrompt ?? "",
            promptTimestamp: Date.now() - 1000,
            response: reply,
            responseTimestamp: Date.now(),
            context: [],
            ...(safetyAdvisory ? { safetyAdvisory } : {}),
          },
        ],
        signiture: "mock-signature",
      }),
    });
  });
}

export async function mockChatSendQuota(page: Page) {
  await page.route("**/api/chat-send", (route) =>
    route.fulfill({
      status: 402,
      contentType: "application/json",
      body: JSON.stringify({
        error: "quota_exhausted",
        message:
          "You've already used your free message. Sign up at DrFuhrman.com to continue.",
      }),
    }),
  );
}

export async function mockChatSendError(page: Page, status = 502) {
  await page.route("**/api/chat-send", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ error: "upstream_error" }),
    }),
  );
}

export async function enterValidEmail(page: Page, email = "qa@divinci.ai") {
  // Email field is only visible while emailRequired === true (i.e. before
  // a valid email has been entered). Locator picks it up by label text.
  const input = page.getByPlaceholder("you@example.com");
  await input.fill(email);
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => window.localStorage.clear());
}

export const test = base.extend({
  // Always start with a clean escrow state so test ordering doesn't bleed.
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.clear();
      } catch {
        /* private mode */
      }
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";
