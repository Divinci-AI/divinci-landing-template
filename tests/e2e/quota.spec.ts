import { test, expect, mockChatSendQuota, enterValidEmail, sendButton } from "./fixtures";

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
  // ⚠️ This spec used to click a STARTER pill, and its header claimed the
  // missing CTA was a measured product defect. It is not.
  //
  // ChatIsland's 402 handler has three branches, and the starter one is
  // deliberate — its comment reads "A starter-budget 402 must NOT flip the page
  // to the SignupCTA — the visitor still has their free manual message." That
  // branch dates to the template's first commit, two months before the
  // measurement the header cited. So the spec was asserting the opposite of
  // intended behaviour, and the failure it produced was correct.
  //
  // The CTA belongs to the MANUAL path: type a message, send it, exhaust the
  // manual quota. That is what this now exercises.
  test("402 on a manual send replaces input with SignupCTA", async ({ page }) => {
    await mockChatSendQuota(page);
    await page.goto("/");
    await enterValidEmail(page);
    await page.locator("form:has(textarea) textarea").fill("A question of my own.");
    await sendButton(page).click();

    await expect(
      page.getByText(/Want to keep talking to/i),
      "a 402 produced no visible change at all — quota exhaustion is silent, and the signup CTA never renders",
    ).toBeVisible();

    // Scoped to the CTA card. A bare name-based locator also matches the
    // header's own "Sign up" link, and strict mode rightly refuses to guess.
    const href = await page
      .getByTestId("signup-cta")
      .getByRole("link", { name: /Sign up/i })
      .getAttribute("href");
    expect(href).toContain("acme.example/signup");
    expect(href).toContain("utm_source=acme-demo");
    expect(href).toContain("utm_campaign=free-message-quota-cta");
  });

  // The other half of the same behaviour, pinned so fixing the manual path
  // cannot regress it: a STARTER 402 must leave the visitor their own free
  // message rather than telling them they are out.
  test("402 on a starter does NOT show the CTA", async ({ page }) => {
    await mockChatSendQuota(page);
    await page.goto("/");
    await enterValidEmail(page);
    await page.locator(".starter-pill").first().click();
    await page.waitForTimeout(1_500);
    await expect(page.getByText(/Want to keep talking to/i)).toHaveCount(0);
  });

});
