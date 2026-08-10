import { test, expect, mockChatSendOk, enterValidEmail } from "./fixtures";

test.describe("Chat send flow (mocked /api/chat-send)", () => {
  test("starter populates input → Enter triggers mocked AI reply", async ({
    page,
  }) => {
    await mockChatSendOk(page, { reply: "Mock answer about getting started." });
    await page.goto("/");
    await enterValidEmail(page);
    await page.locator(".starter-pill").first().click();
    // Starter now POPULATES instead of auto-sending — press Enter to fire.
    await page.getByPlaceholder(/Type your question/i).press("Enter");
    await expect(
      page.getByText("Mock answer about getting started."),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("typed prompt + Enter key triggers send", async ({ page }) => {
    await mockChatSendOk(page, { reply: "Typed-path synthetic reply." });
    await page.goto("/");
    // Pass the email gate
    await enterValidEmail(page);
    // Textarea is now enabled — type a custom prompt and press Enter
    const textarea = page.getByPlaceholder(/Type your question/i);
    await textarea.fill("What does Acme Expert do?");
    await textarea.press("Enter");
    await expect(page.getByText("Typed-path synthetic reply.")).toBeVisible({
      timeout: 10_000,
    });
  });
});
