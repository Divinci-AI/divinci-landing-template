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
          "You've already used your free message. Sign up to continue.",
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

/**
 * Pass the email gate if there IS one. Returns whether a gate was present.
 *
 * The field is only rendered while `emailRequired === true`. A demo whose
 * gate is off never shows it — so an unconditional `.fill()` waits out the
 * full 10s action timeout and fails, taking the rest of the spec with it.
 * That is not a hypothetical: pointed at the deployed fleet for the first
 * time, this single assumption accounted for 20 of 27 failures, every one
 * of them on a demo that was working correctly.
 *
 * Deliberately short: this asks "is the gate on right now", and the page has
 * already loaded by the time it is called. Waiting the default timeout to
 * learn that something is absent is how a fast suite becomes a slow one.
 */
export async function enterValidEmail(page: Page, email = "qa@divinci.ai"): Promise<boolean> {
  const input = page.getByPlaceholder("you@example.com");
  if (!(await input.isVisible({ timeout: 2_000 }).catch(() => false))) return false;
  await input.fill(email);
  return true;
}

/**
 * The send control, located by ACCESSIBLE NAME rather than visible text.
 *
 * Its label is brand copy: the template says "Send", caseymeans.com says
 * "Ask", and any demo may say something else again. `aria-label="Send
 * message"` is the part that does not move, because it is an accessibility
 * contract rather than marketing copy — so it is the right thing to bind a
 * test to. Matching visible text made 5 specs unrunnable on every demo whose
 * button says anything but "Send".
 */
export function sendButton(page: Page) {
  // Scoped to the FORM that owns the textarea, not picked by position.
  //
  // Demos render two chat widgets: the hero form (a <textarea> + its button)
  // and a sticky bar (an <input> + its own button). Both buttons match any
  // name-based locator, so .first()/.last() is a guess about DOM order —
  // and it was a losing one either way: .last() left network-error-retry and
  // quota failing on every demo, while .first() fixed one spec and broke two
  // others (3 → 5 failures on aurapath and evonexus).
  //
  // The specs type into the textarea, so the button they mean is the one in
  // the same form. `form:has(textarea)` says exactly that, and stays correct
  // if either widget moves in the DOM.
  return chatForm(page).getByRole("button", { name: /send message|^send$|^ask$/i }).first();
}

/** The hero chat form — the one containing the textarea the specs type into. */
export function chatForm(page: Page) {
  return page.locator("form:has(textarea)").first();
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => window.localStorage.clear());
}

/**
 * Block until every Astro island has hydrated.
 *
 * THIS IS THE FLAKINESS. The chat UI is an island: its markup is server-
 * rendered, so the textarea and all three `.starter-pill` buttons are in the
 * DOM — visible, enabled, and passing every actionability check Playwright
 * has — for roughly 300ms BEFORE any event listener is attached. A click in
 * that window is silently swallowed. Nothing errors; the page simply does not
 * respond, and the test fails later with "element not found" for a reply that
 * was never requested.
 *
 * Measured on a deployed demo: at `load`, islands=1 unhydrated=1 pills=3.
 * By +300ms, unhydrated=0. Whether a spec landed its click was therefore a
 * race against its own overhead — which is why three consecutive runs of
 * identical code gave 4, 4 and 5 failures.
 *
 * `astro-island[ssr]` is the signal: Astro sets the attribute in the SSR
 * output and removes it on hydration, so counting it to zero is a direct
 * observation of hydration rather than a sleep.
 */
export async function awaitHydration(page: Page): Promise<void> {
  await page
    .waitForFunction(() => document.querySelectorAll("astro-island[ssr]").length === 0, null, {
      timeout: 15_000,
    })
    // Never fail a spec here. A page with no islands at all (or one that
    // genuinely never hydrates) is a real defect, but it belongs to whatever
    // assertion the spec was going to make — not to a helper whose only job is
    // to stop racing.
    .catch(() => {});
}

export const test = base.extend({
  // Always start with a clean escrow state so test ordering doesn't bleed.
  page: async ({ page }, use) => {
    // goto is wrapped rather than exposing a gotoReady() helper the specs must
    // remember to call. The failure this prevents is SILENT — a swallowed
    // click, not an error — so an opt-in guard would be forgotten exactly
    // where it matters and the flake would come straight back.
    const origGoto = page.goto.bind(page);
    page.goto = (async (url: string, opts?: Parameters<Page["goto"]>[1]) => {
      const res = await origGoto(url, opts);
      await awaitHydration(page);
      return res;
    }) as Page["goto"];
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
