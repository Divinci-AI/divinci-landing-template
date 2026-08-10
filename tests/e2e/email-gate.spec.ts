import { test, expect, mockChatSendOk, sendButton } from "./fixtures";

/**
 * Every test here presupposes a gate. A demo configured without one is not
 * failing these — the premise does not apply — so they SKIP rather than fail.
 *
 * Skip, not delete: the gate is per-demo configuration, so the same spec file
 * must be able to assert the gate hard on the demos that have one and stay
 * silent on the demos that do not.
 */
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  const gated = await page
    .getByPlaceholder("you@example.com")
    .isVisible({ timeout: 2_000 })
    .catch(() => false);
  test.skip(!gated, "this demo has no email gate — nothing to test");
});

test.describe("Email gate", () => {
  test("invalid email format keeps Send disabled", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("not-an-email");
    // Textarea is always enabled; the gate is on Send.
    await expect(
      sendButton(page),
    ).toBeDisabled();
  });

  test("disposable email triggers the inline error immediately", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("trash@mailinator.com");
    // Error appears via the live watcher in MessageInput — no submit needed.
    await expect(
      page.getByText(/disposable inboxes aren't supported/i),
    ).toBeVisible();
    // Email gate stays up — Send remains disabled even with a draft.
    await page.getByPlaceholder(/Type your question/i).fill("hello");
    await expect(
      sendButton(page),
    ).toBeDisabled();
  });

  test("valid email keeps field visible (with confirmation) + unlocks Send", async ({
    page,
  }) => {
    await page.goto("/");
    const email = page.getByPlaceholder("you@example.com");
    await email.fill("qa@divinci.ai");
    // Email field stays visible — only the label flips to "Your email ✓".
    await expect(email).toBeVisible();
    await expect(page.getByText(/Your email/i)).toBeVisible();
    // Type a question so Send has content to send.
    await page.getByPlaceholder(/Type your question/i).fill("hello");
    // Send is now enabled (email valid + draft non-empty).
    await expect(
      sendButton(page),
    ).toBeEnabled();
  });
});
