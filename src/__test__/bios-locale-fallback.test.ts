import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A bio card's role must never fall back to English on a translated page.
 *
 * `brand.config` is NOT localized — one config serves all 35 languages. The
 * i18n `bios.roles` array is localized but is produced by a different process
 * and is routinely SHORTER than `brand.bios`, so the renderer's fallback fires
 * often. On EvoNexus's French page six cards read "Team" in English amid fluent
 * French, which reads as a half-finished translation because that is what it is.
 *
 * The card keeps the person's name and photograph either way; the role is the
 * part it can afford to drop.
 */
const src = readFileSync(
  join(process.cwd(), "src/components/sections/BiosSection.astro"),
  "utf8",
);

describe("bios role fallback", () => {
  it("only falls back to the un-localized config title on the DEFAULT locale", () => {
    expect(src).toMatch(/isDefaultLocale\s*\?\s*b\.title\s*:\s*""/);
  });

  it("computes the default-locale check from the rendered lang", () => {
    expect(src).toMatch(/const isDefaultLocale = lang === DEFAULT_LOCALE/);
  });

  it("never falls back to b.title unconditionally", () => {
    const code = src
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    // The bug: `t.roles[i] ?? b.title`, with no locale condition.
    expect(code).not.toMatch(/t\.roles\[i\]\s*\?\?\s*b\.title/);
  });

  it("does not render an empty role element", () => {
    // An empty string must produce no markup, or the card grows a blank line
    // exactly where the missing translation was.
    expect(src).toMatch(/\{bio\.role\s*&&/);
  });

  it("still renders the name and the photo when the role is dropped", () => {
    // The role is the only thing that degrades — the identifying parts stay.
    expect(src).toMatch(/\{bio\.name\}/);
    expect(src).toMatch(/bio\.image/);
  });

  it("the comment stripper actually strips — otherwise the check above is vacuous", () => {
    expect(src).toContain("//");
    expect(src.replace(/^\s*\/\/.*$/gm, "")).not.toMatch(/^\s*\/\/ ⚠️/m);
  });
});
