import { test, expect, mockChatSendQuota } from "./fixtures";

test.describe("Quota exhaustion → SignupCTA", () => {
  test("402 from /api/chat-send replaces input with SignupCTA", async ({
    page,
  }) => {
    await mockChatSendQuota(page);
    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("qa@divinci.ai");
    await page
      .getByRole("button", { name: /specialize in/i })
      .first()
      .click();
    // Starter populates; press Enter to actually fire the send → 402.
    await page.getByPlaceholder(/Type your question/i).press("Enter");
    // SignupCTA card replaces the MessageInput
    await expect(
      page.getByText(/Want to keep talking to the Acme Expert AI/i),
    ).toBeVisible();
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
