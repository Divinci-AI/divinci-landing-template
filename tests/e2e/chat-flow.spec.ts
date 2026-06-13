import { test, expect, mockChatSendOk } from "./fixtures";

test.describe("Chat send flow (mocked /api/chat-send)", () => {
  test("starter populates input → Enter triggers mocked AI reply", async ({
    page,
  }) => {
    await mockChatSendOk(page, { reply: "Mock answer about Nutritarian." });
    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("qa@divinci.ai");
    await page
      .getByRole("button", { name: /Nutritarian is all about/i })
      .first()
      .click();
    // Starter now POPULATES instead of auto-sending — press Enter to fire.
    await page.getByPlaceholder(/Type your question/i).press("Enter");
    await expect(
      page.getByText("Mock answer about Nutritarian."),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("typed prompt + Enter key triggers send", async ({ page }) => {
    await mockChatSendOk(page, { reply: "Typed-path synthetic reply." });
    await page.goto("/");
    // Pass the email gate
    await page.getByPlaceholder("you@example.com").fill("qa@divinci.ai");
    // Textarea is now enabled — type a custom prompt and press Enter
    const textarea = page.getByPlaceholder(/Type your question/i);
    await textarea.fill("What is a Nutritarian diet?");
    await textarea.press("Enter");
    await expect(page.getByText("Typed-path synthetic reply.")).toBeVisible({
      timeout: 10_000,
    });
  });
});
