import { test, expect, mockChatSendQuota, enterValidEmail } from "./fixtures";

test.describe("Quota exhaustion → SignupCTA", () => {
  test("402 from /api/chat-send replaces input with SignupCTA", async ({
    page,
  }) => {
    await mockChatSendQuota(page);
    await page.goto("/");
    await enterValidEmail(page);
    // Clicking the starter IS the send — it fires the request directly.
    await page.locator(".starter-pill").first().click();
    // SignupCTA card replaces the MessageInput. The assistant's NAME is brand
    // copy ("the Acme Expert AI" is the template's placeholder), so match only
    // the invariant part of the sentence.
    await expect(page.getByText(/Want to keep talking to/i)).toBeVisible();
    // CTA link points at the membership URL with UTM ref params
    const cta = page.getByRole("link", {
      name: /Sign up/i,
    });
    const href = await cta.getAttribute("href");
    expect(href).toContain("acme.example/signup");
    expect(href).toContain("utm_source=acme-demo");
    expect(href).toContain("utm_campaign=free-message-quota-cta");
  });
});
