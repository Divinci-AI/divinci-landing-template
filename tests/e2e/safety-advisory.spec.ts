import { test, expect, mockChatSendOk, enterValidEmail } from "./fixtures";

/**
 * Medical-safety advisory banner — when the server's medicalSafety check
 * flags a reply, the transcript entry carries `safetyAdvisory` and the UI
 * renders an amber banner under the assistant bubble. A reply without the
 * field renders no banner.
 */

const ADVISORY_TEXT =
  "This assistant can't provide medical advice about medications, dosing, or " +
  "treatment changes. Please talk with your physician before making any " +
  "changes to your medications or treatment plan.";

test("flagged reply renders the safety-advisory banner", async ({ page }) => {
  await mockChatSendOk(page, {
    reply: "General wellness information about your question.",
    safetyAdvisory: {
      severity: "review",
      text: ADVISORY_TEXT,
      categories: ["medication-topic"],
    },
  });
  await page.goto("/");
  await enterValidEmail(page);
  const textarea = page.getByPlaceholder(/Type your question/i);
  await textarea.fill("Should I change my medication?");
  await textarea.press("Enter");

  await expect(
    page.getByText("General wellness information about your question."),
  ).toBeVisible({ timeout: 10_000 });
  const banner = page.getByTestId("safety-advisory");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("talk with your physician");
});

test("clean reply renders no advisory banner", async ({ page }) => {
  await mockChatSendOk(page, { reply: "Leafy greens are highly nutritious." });
  await page.goto("/");
  await enterValidEmail(page);
  const textarea = page.getByPlaceholder(/Type your question/i);
  await textarea.fill("Why are greens healthy?");
  await textarea.press("Enter");

  await expect(
    page.getByText("Leafy greens are highly nutritious."),
  ).toBeVisible({ timeout: 10_000 });
  await expect(page.getByTestId("safety-advisory")).toHaveCount(0);
});
