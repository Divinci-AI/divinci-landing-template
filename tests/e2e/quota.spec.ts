import { test, expect, mockChatSendQuota, enterValidEmail } from "./fixtures";

/**
 * ⚠️ EXPECTED TO FAIL ON THE DEPLOYED FLEET, AND THE FAILURE IS REAL.
 *
 * Measured 2026-08-10 against a live demo with a mocked 402: the page text
 * does not change by a single character. No CTA, no error, no echo of the
 * user's own message — the click is silently swallowed. For comparison, a
 * mocked 500 on the same page DOES render "Network error — that message
 * wasn't delivered", so error handling exists; the quota path specifically
 * has no user-visible outcome.
 *
 * Impact: a visitor who uses up the free messages sees the demo simply stop
 * responding. They have no way to know why, and the signup CTA — the entire
 * conversion path out of a free demo — never appears.
 *
 * The href assertions below still carry the template's placeholder values
 * (acme.example, acme-demo). Those are deliberately NOT relaxed yet: nothing
 * has ever rendered this card on a real demo, so there is no observed
 * brand-shaped output to write an assertion against. Fix the defect first,
 * then loosen these the way footer-links was loosened.
 */
test.describe("Quota exhaustion → SignupCTA", () => {
  test("402 from /api/chat-send replaces input with SignupCTA", async ({ page }) => {
    await mockChatSendQuota(page);
    await page.goto("/");
    await enterValidEmail(page);
    // Clicking the starter IS the send — it fires the request directly.
    await page.locator(".starter-pill").first().click();

    await expect(
      page.getByText(/Want to keep talking to/i),
      "a 402 produced no visible change at all — quota exhaustion is silent, and the signup CTA never renders",
    ).toBeVisible();

    const cta = page.getByRole("link", { name: /Sign up/i });
    const href = await cta.getAttribute("href");
    expect(href).toContain("acme.example/signup");
    expect(href).toContain("utm_source=acme-demo");
    expect(href).toContain("utm_campaign=free-message-quota-cta");
  });
});
