import { describe, it, expect } from "vitest";
import { withRef, REF_SOURCE, REF_MEDIUM } from "./links";

describe("withRef", () => {
  it("appends utm_source + utm_medium to a bare URL", () => {
    const u = new URL(withRef("https://drfuhrman.com"));
    expect(u.searchParams.get("utm_source")).toBe(REF_SOURCE);
    expect(u.searchParams.get("utm_medium")).toBe(REF_MEDIUM);
  });

  it("appends utm_campaign when provided", () => {
    const u = new URL(withRef("https://drfuhrman.com", "header-nav"));
    expect(u.searchParams.get("utm_campaign")).toBe("header-nav");
  });

  it("omits utm_campaign when not provided", () => {
    const u = new URL(withRef("https://drfuhrman.com"));
    expect(u.searchParams.has("utm_campaign")).toBe(false);
  });

  it("preserves existing UTM keys (no clobber)", () => {
    const inUrl =
      "https://drfuhrman.com/?utm_source=keep-me&utm_campaign=hand-tagged";
    const out = new URL(withRef(inUrl, "would-be-overwritten"));
    expect(out.searchParams.get("utm_source")).toBe("keep-me");
    expect(out.searchParams.get("utm_campaign")).toBe("hand-tagged");
    // utm_medium was absent → gets added
    expect(out.searchParams.get("utm_medium")).toBe(REF_MEDIUM);
  });

  it("preserves non-UTM query params", () => {
    const inUrl = "https://drfuhrman.com/path?foo=bar&baz=qux";
    const out = new URL(withRef(inUrl));
    expect(out.searchParams.get("foo")).toBe("bar");
    expect(out.searchParams.get("baz")).toBe("qux");
    expect(out.searchParams.get("utm_source")).toBe(REF_SOURCE);
  });

  it("preserves the URL path + fragment", () => {
    const out = withRef("https://drfuhrman.com/path/to/page#section");
    expect(out).toContain("/path/to/page");
    expect(out).toContain("#section");
  });

  it("passes through invalid URLs unchanged", () => {
    expect(withRef("not a url")).toBe("not a url");
    expect(withRef("mailto:hi@drfuhrman.com")).toBeTruthy();
  });

  it("handles empty string gracefully", () => {
    expect(withRef("")).toBe("");
  });
});
