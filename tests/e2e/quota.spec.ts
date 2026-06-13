import { test, expect, mockChatSendQuota } from "./fixtures";

test.describe("Quota exhaustion → SignupCTA", () => {
  test("402 from /api/chat-send replaces input with SignupCTA", async ({
    page,
  }) => {
    await mockChatSendQuota(page);
    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("qa@divinci.ai");
    await page
      .getByRole("button", { name: /Nutritarian is all about/i })
      .first()
      .click();
    // Starter populates; press Enter to actually fire the send → 402.
    await page.getByPlaceholder(/Type your question/i).press("Enter");
    // SignupCTA card replaces the MessageInput
    await expect(
      page.getByText(/Want to keep talking to Dr\. Fuhrman's AI\?/i),
    ).toBeVisible();
    // CTA link points at the membership URL with UTM ref params
    const cta = page.getByRole("link", {
      name: /Sign up at DrFuhrman\.com/i,
    });
    const href = await cta.getAttribute("href");
    expect(href).toContain("drfuhrman.com/membership");
    expect(href).toContain("utm_source=drfuhrman-ai");
    expect(href).toContain("utm_campaign=free-message-quota-cta");
  });
});
