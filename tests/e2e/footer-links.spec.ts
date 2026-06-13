import { test, expect } from "./fixtures";

test.describe("Footer outbound links carry UTM ref params", () => {
  test("AI Safety + Terms + Privacy + Divinci credit all tagged", async ({
    page,
  }) => {
    await page.goto("/");
    // Scroll footer into view
    await page
      .getByText(/Powered by/, { exact: false })
      .last()
      .scrollIntoViewIfNeeded();

    const links = [
      { name: /^AI Safety & Ethics$/, mustContain: "divinci.ai/ai-safety" },
      { name: /^Terms$/, mustContain: "divinci.ai/terms-of-service" },
      { name: /^Privacy$/, mustContain: "divinci.ai/privacy-policy" },
      { name: /^Divinci AI$/, mustContain: "divinci.ai" },
    ];
    for (const link of links) {
      const a = page.getByRole("link", { name: link.name }).first();
      const href = await a.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).toContain(link.mustContain);
      expect(href).toContain("utm_source=drfuhrman-ai");
      expect(href).toContain("utm_medium=referral");
      expect(await a.getAttribute("target")).toBe("_blank");
      expect(await a.getAttribute("rel")).toContain("noopener");
    }
  });
});
