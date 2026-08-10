import { test, expect, enterValidEmail } from "./fixtures";

test.describe("Example cards", () => {
  test("click populates draft, focuses textarea, glow class engages", async ({
    page,
  }) => {
    await page.goto("/");
    // Enter email first so the textarea is enabled when populate fires.
    // (Glow activates as soon as draft has content, even with email
    // gate active — but focus only happens when not emailRequired.)
    await enterValidEmail(page);
    // Example cards are optional content — a demo may ship conversation
    // starters instead, or neither. Absent is not broken.
    test.skip(
      (await page.locator(".example-card").count()) === 0,
      "this demo ships no example cards",
    );
    // Click the first example card
    const card = page.locator(".example-card").first();
    const question = await card.getAttribute("data-question");
    expect(question).toBeTruthy();
    await card.click();
    // Hero is now in viewport
    const hero = page.locator("#hero");
    await expect(hero).toBeInViewport({ ratio: 0.1 });
    // Textarea is always enabled now — populated draft sits in it,
    // ready for Enter once the email is valid.
    const textarea = page.getByPlaceholder(/Type your question/i);
    await expect(textarea).toHaveValue(question!);
    // Send glow wrapper is active class once draft has content.
    const sendGlow = page.locator(".send-glow-wrap").first();
    await expect(sendGlow).toHaveClass(/is-active/);
  });
});
