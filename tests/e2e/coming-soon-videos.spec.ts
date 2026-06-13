import { test, expect } from "./fixtures";

test.describe("Coming-soon videos play only on hover", () => {
  test("video pauses by default, plays on hover, pauses on leave", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator(".video-hover-card").first();
    await card.scrollIntoViewIfNeeded();
    const video = card.locator("video");

    // Assert default paused state. (Some browsers haven't loaded the
    // metadata yet — wait for readyState >= 1 first.)
    await page.waitForFunction((v: Element | null) => {
      const el = v as HTMLVideoElement | null;
      return !!el && el.readyState >= 1;
    }, await video.elementHandle());

    const initiallyPaused = await video.evaluate(
      (v) => (v as HTMLVideoElement).paused,
    );
    expect(initiallyPaused).toBe(true);

    // Hover and confirm playback.
    await card.hover();
    await expect
      .poll(
        async () =>
          await video.evaluate((v) => !(v as HTMLVideoElement).paused),
        { timeout: 5_000 },
      )
      .toBe(true);

    // Move pointer out of the card and confirm pause.
    await page.mouse.move(0, 0);
    await expect
      .poll(
        async () =>
          await video.evaluate((v) => (v as HTMLVideoElement).paused),
        { timeout: 5_000 },
      )
      .toBe(true);
  });
});
