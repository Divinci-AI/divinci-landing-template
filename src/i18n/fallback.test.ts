import { describe, expect, it } from "vitest";
import { __withEnglishFallback as merge, getUI } from "./index";

describe("per-string English fallback (stale translations reused on rebuild)", () => {
  const en = { hero: { title: "Ask anything", sub: "Answers 24/7" }, newKey: "Sign in", list: ["a", "b"] };

  it("fills a key the translation predates from English", () => {
    const fr = { hero: { title: "Demandez", sub: "Réponses 24/7" }, list: ["x", "y"] };
    expect(merge(fr, en)).toEqual({ hero: { title: "Demandez", sub: "Réponses 24/7" }, newKey: "Sign in", list: ["x", "y"] });
  });
  it("fills empty strings and missing nested objects", () => {
    expect(merge({ hero: { title: "" } }, en).hero).toEqual({ title: "Ask anything", sub: "Answers 24/7" });
    expect(merge({}, en).hero.title).toBe("Ask anything");
  });
  it("never mixes arrays; an absent or empty one falls back whole", () => {
    expect(merge({ list: [] }, en).list).toEqual(["a", "b"]);
  });
  it("English and unknown locales still return the English dictionary itself", () => {
    expect(getUI("en")).toBe(getUI("zz-not-a-locale"));
  });
});
