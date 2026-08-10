import { test, expect, sendButton, enterValidEmail } from "./fixtures";

/**
 * ⚠️ THIS SPEC IS EXPECTED TO FAIL, AND THE FAILURE IS REAL.
 *
 * Do not "fix" it by changing the assertion. Found 2026-08-10 by running the
 * suite against the deployed fleet for the first time:
 *
 *   type a question → click the send button → NO request is made.
 *   type a question → press Enter          → the request is made.
 *
 * Reproduced against the LIVE endpoint with no mocking and no route
 * interception, on the same page, in the same session: button click 0 POSTs,
 * Enter 1 POST. The control is `type="submit"`, inside the form, enabled and
 * not covered — so the browser is doing its part and something in the submit
 * handler is dropping it. Enter appears to take a different code path.
 *
 * Impact: a visitor who types a question and clicks the visible button gets
 * nothing at all — no send, no error, no spinner. Only keyboard users get
 * through. That is the primary call-to-action on every demo we send.
 *
 * It is isolated here on purpose. Three other specs were failing on this one
 * root cause, which made it read as "the E2E suite is broken" rather than
 * "the send button is broken".
 */
test.describe("Send button", () => {
  test("clicking the send control actually sends", async ({ page }) => {
    let posts = 0;
    await page.route("**/api/chat-send", (route) => {
      posts++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transcript: [
            {
              prompt: "q",
              promptTimestamp: Date.now() - 1000,
              response: "ok",
              responseTimestamp: Date.now(),
              context: [],
            },
          ],
          signiture: "mock",
        }),
      });
    });

    await page.goto("/");
    await enterValidEmail(page);
    await page.getByPlaceholder(/Type your question/i).fill("does the button work?");

    const btn = sendButton(page);
    await expect(btn, "send control should be enabled once a draft exists").toBeEnabled();
    await btn.click();
    await page.waitForTimeout(3_000);

    expect(
      posts,
      "clicking the send button issued no request — keyboard-only send is a broken primary CTA",
    ).toBeGreaterThan(0);
  });

  test("the same draft sends fine via Enter — isolating the button as the cause", async ({
    page,
  }) => {
    let posts = 0;
    await page.route("**/api/chat-send", (route) => {
      posts++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transcript: [
            {
              prompt: "q",
              promptTimestamp: Date.now() - 1000,
              response: "ok",
              responseTimestamp: Date.now(),
              context: [],
            },
          ],
          signiture: "mock",
        }),
      });
    });

    await page.goto("/");
    await enterValidEmail(page);
    const ta = page.getByPlaceholder(/Type your question/i);
    await ta.fill("does Enter work?");
    await ta.press("Enter");
    await page.waitForTimeout(3_000);

    // This one PASSES. Its job is to prove the failure above is the button
    // and not the mock, the draft, the gate, or hydration.
    //
    // Nothing is asserted about the form afterwards: the chat form UNMOUNTS
    // once a send goes through, so checking it is still visible here fails for
    // a reason that has nothing to do with what this test is isolating.
    expect(posts, "Enter should send").toBeGreaterThan(0);
  });
});
