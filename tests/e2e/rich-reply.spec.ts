import { test, expect, mockChatSendOk, enterValidEmail } from "./fixtures";

/**
 * Replies captured from live demos in the 2026-09-28 prospect rehearsal,
 * replayed through a mocked chat-send so the RENDERED page is what's asserted.
 */

async function ask(page: import("@playwright/test").Page, q: string) {
  await page.goto("/");
  await enterValidEmail(page);
  const textarea = page.getByPlaceholder(/Type your question/i);
  await textarea.fill(q);
  await textarea.press("Enter");
}

test("a '* ' bullet list renders as a list with no stray asterisks", async ({ page }) => {
  await mockChatSendOk(page, {
    reply:
      "Our doctors who specialize in knee replacement are:\n" +
      "* Dr. Jonathon M. Spanyer: knee replacement.\n" +
      "* Dr. Shankar Narayanan: hip and knee surgery.\n" +
      "* Dr. Matthew S. Grunkemeyer: joint replacement.",
  });
  await ask(page, "Which doctors do knee replacement?");
  const items = page.locator("[role=log] li");
  await expect(items).toHaveCount(3, { timeout: 10_000 });
  await expect(items.nth(2)).toHaveText("Dr. Matthew S. Grunkemeyer: joint replacement.");
  await expect(page.locator("[role=log]")).not.toContainText("* Dr.");
});

test("a markdown link renders as a link, not raw markdown", async ({ page }) => {
  await mockChatSendOk(page, {
    reply: "For coverage details, please visit our [About Us](https://www.example.com/about) page.",
  });
  await ask(page, "Do you take my insurance?");
  const link = page.locator("[role=log] a", { hasText: "About Us" });
  await expect(link).toHaveAttribute("href", "https://www.example.com/about", { timeout: 10_000 });
  await expect(page.locator("[role=log]")).not.toContainText("](");
});

test("a moderation refusal reads as a person would say it, once", async ({ page }) => {
  const LIVE = "I can't help with that request.\n\nMessage considered harmful (Specialized Advice).";
  await mockChatSendOk(page, {
    reply: LIVE,
    safetyAdvisory: { severity: "severe", text: LIVE, categories: ["noHarmful"] },
  });
  await ask(page, "I have knee pain when I run. Do I need surgery?");
  await expect(page.locator("[role=log]")).toContainText("qualified professional", { timeout: 10_000 });
  await expect(page.locator("body")).not.toContainText("considered harmful");
  await expect(page.getByTestId("safety-advisory")).toHaveCount(0);
});
