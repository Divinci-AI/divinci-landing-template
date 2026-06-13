import { test, expect } from "./fixtures";

test.describe("Hero render", () => {
  test("logo + slogan + chat island mount on first paint", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(
      page.getByRole("img", { name: /^Dr\. Fuhrman$/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Every book. Every lecture. Every answer."),
    ).toBeVisible();
    // Welcome bubble copy comes from FALLBACK_RELEASE.
    await expect(
      page.getByText("Hi, I'm Dr. Joel Fuhrman's AI"),
    ).toBeVisible();
    // Email gate is the initial state for a clean session.
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    // Textarea is always enabled so Tab from the email field reaches
    // it cleanly — disabled-only-until-email-valid was the old gate.
    await expect(
      page.getByPlaceholder(/Type your question/i),
    ).toBeEnabled();
  });

  test("Send button is disabled when email empty", async ({ page }) => {
    await page.goto("/");
    const send = page.getByRole("button", { name: "Send" });
    await expect(send).toBeDisabled();
  });
});
