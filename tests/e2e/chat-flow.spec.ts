import { test, expect, mockChatSendOk, enterValidEmail } from "./fixtures";

test.describe("Chat send flow (mocked /api/chat-send)", () => {
  test("starter populates input → Enter triggers mocked AI reply", async ({
    page,
  }) => {
    await mockChatSendOk(page, { reply: "Mock answer about getting started." });
    await page.goto("/");
    await enterValidEmail(page);
    // The starter SENDS on click. The comment here used to say it only
    // populates the draft and that Enter fires it — that was true once and is
    // not now: on the deployed fleet the click posts immediately, the draft is
    // left empty, and the textarea unmounts, so the follow-up Enter could
    // never land. It failed on 37 of 37 demos.
    await page.locator(".starter-pill").first().click();
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
