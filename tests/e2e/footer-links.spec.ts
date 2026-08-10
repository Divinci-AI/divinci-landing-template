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
      // utm_source is PER-BRAND ("caseymeans-demo", "aurapath-demo", …), so
      // pinning the template's own "acme-demo" asserted that the pipeline had
      // failed to brand the page. Assert the parameter is present and
      // non-empty; its value is the thing that is supposed to vary.
      expect(new URL(href!).searchParams.get("utm_source")).toMatch(/.+-demo$/);
      expect(href).toContain("utm_medium=referral");
      expect(await a.getAttribute("target")).toBe("_blank");
      expect(await a.getAttribute("rel")).toContain("noopener");
    }
  });
});
