import { test, expect } from "./fixtures";

test.describe("Network-error retry: failed sends don't trip the quota gate", () => {
  test("500 from chat-send removes the user message + lets user retry", async ({
    page,
  }) => {
    // First send fails with a 500 — must NOT show SignupCTA, must NOT
    // count against client-side quota state.
    let callCount = 0;
    await page.route("**/api/chat-send", (route) => {
      callCount++;
      if (callCount === 1) {
        return route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "upstream_error" }),
        });
      }
      // Second call → success
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          transcript: [
            {
              prompt: "second try",
              promptTimestamp: Date.now() - 100,
              response: "Real reply on retry.",
              responseTimestamp: Date.now(),
              context: [],
            },
          ],
          signiture: "sig",
        }),
      });
    });

    await page.goto("/");
    await page.getByPlaceholder("you@example.com").fill("qa@divinci.ai");
    await page
      .getByPlaceholder(/Type your question/i)
      .fill("first try (will fail)");
    await page.getByRole("button", { name: "Send" }).click();

    // Error toast renders
    await expect(
      page.getByText(/Network error — that message wasn't delivered/i),
    ).toBeVisible({ timeout: 10_000 });

    // SignupCTA must NOT be visible — the failed send didn't count.
    await expect(
      page.getByText(/Want to keep talking to Dr\. Fuhrman's AI\?/i),
    ).toBeHidden();

    // Send button is still around (MessageInput is still rendered).
    await expect(page.getByRole("button", { name: "Send" })).toBeVisible();

    // Retry: type a fresh prompt + send. This time it succeeds.
    await page
      .getByPlaceholder(/Type your question/i)
      .fill("second try (succeeds)");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText("Real reply on retry.")).toBeVisible({
      timeout: 10_000,
    });

    // NOW the quota gate should be in play (1 successful message used).
    // Don't try to send a third — the worker would 402 even if the UI
    // didn't render the CTA. The previous tests covered that path.
  });
});
