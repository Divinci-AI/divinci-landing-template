import { test, expect, mockChatSendOk } from "./fixtures";

test.describe("Email gate", () => {
  test("invalid email format keeps Send disabled", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("not-an-email");
    // Textarea is always enabled; the gate is on Send.
    await expect(
      page.getByRole("button", { name: "Send" }),
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
      page.getByRole("button", { name: "Send" }),
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
      page.getByRole("button", { name: "Send" }),
    ).toBeEnabled();
  });
});
