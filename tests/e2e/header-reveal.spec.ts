import { test, expect } from "./fixtures";

test.describe("Sticky header reveal", () => {
  test("header hidden at top of page, slides in after scrolling past hero", async ({
    page,
  }) => {
    await page.goto("/");
    const header = page.locator("#site-header");
    await expect(header).toHaveClass(/header-hidden/);

    // Scroll past the hero
    await page.evaluate(() => {
      const hero = document.getElementById("hero");
      const rect = hero?.getBoundingClientRect();
      window.scrollTo({ top: (rect?.bottom ?? 0) + 100, behavior: "auto" });
    });
    // Give the IntersectionObserver a tick to fire
    await page.waitForTimeout(300);
    await expect(header).not.toHaveClass(/header-hidden/);
  });
});
