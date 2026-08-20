import { test, expect } from "./fixtures";

/**
 * Needs a brand that configures `comingSoon[].video`. The template ships none
 * — no .mp4/.webm anywhere in the build — so the <video> element never reaches
 * readyState 1 and this spec times out rather than failing meaningfully. It
 * was carried over from a real brand's suite and never adapted.
 *
 * Skipped, not deleted: the hover-play behaviour is real and worth testing on
 * any brand that does supply videos.
 */
test.skip(
  !process.env.E2E_BRAND_HAS_VIDEOS,
  "template configures no coming-soon videos; set E2E_BRAND_HAS_VIDEOS on a brand that does",
);

test.describe("Coming-soon videos play only on hover", () => {
  test("video pauses by default, plays on hover, pauses on leave", async ({
    page,
  }) => {
    await page.goto("/");
    const card = page.locator(".video-hover-card").first();
    // Coming-soon videos are optional content. A demo that ships none is not
    // failing this — it simply has nothing to hover.
    test.skip(
      (await page.locator(".video-hover-card").count()) === 0,
      "this demo ships no coming-soon video cards",
    );
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
