import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * A missing brand asset must render NOTHING, never a broken element.
 *
 * The template ships `logo.svg` and `favicon.svg` in public/brand/, so those
 * defaults resolve. It has never shipped `hero.webp` or `corpus.webm` — yet
 * both sections defaulted to those paths. Every site generated without art
 * therefore emitted an <img>/<video> pointing at a file that did not exist.
 *
 * This stayed invisible because of how the site is served: the Worker's SPA
 * fallback answers a missing asset with **200 and an HTML body**, so nothing
 * 404s. The page simply renders blank where the media should be, and any check
 * that trusts the status code reports it healthy. It was caught by measuring
 * what the browser actually painted (naturalWidth 0 / no video frames).
 */
const src = (rel: string) => readFileSync(join(process.cwd(), "src", rel), "utf8");

describe("missing brand media", () => {
  it("the hero image is conditional, not defaulted to a file we do not ship", () => {
    const hero = src("components/sections/HeroSection.astro");
    expect(hero).toMatch(/\{brand\.media\.heroImage\s*&&/);
    expect(hero).not.toMatch(/heroImage\s*\?\?/);
  });

  it("the corpus video is conditional, not defaulted to a file we do not ship", () => {
    const corpus = src("components/sections/CorpusSection.astro");
    expect(corpus).toMatch(/\{brand\.media\.corpusVideo\s*&&/);
    expect(corpus).not.toMatch(/corpusVideo\s*\?\?/);
  });

  it("no section falls back to a hero/corpus path the template does not ship", () => {
    // Comments are stripped first: the fix is documented IN these files, and
    // the documentation necessarily quotes the very paths being banned. An
    // earlier version of this test failed on its own explanatory comment.
    // `logo.svg` and `favicon.svg` are deliberately NOT banned — those files
    // exist, so defaulting to them is correct.
    const stripComments = (s: string) =>
      s
        .replace(/<!--[\s\S]*?-->/g, "") // astro/html
        .replace(/\/\*[\s\S]*?\*\//g, "") // block
        .replace(/^\s*\/\/.*$/gm, ""); // line
    for (const file of ["HeroSection.astro", "CorpusSection.astro"]) {
      const s = stripComments(src(`components/sections/${file}`));
      expect(s).not.toContain('"/brand/hero.webp"');
      expect(s).not.toContain('"/brand/corpus.webm"');
    }
  });

  it("the comment stripper actually strips — otherwise the test above is vacuous", () => {
    // Guards the guard: if stripComments silently did nothing, the assertions
    // above would still pass on any file with no comments at all.
    const hero = src("components/sections/HeroSection.astro");
    expect(hero).toContain("<!--");
    expect(hero.replace(/<!--[\s\S]*?-->/g, "")).not.toContain("<!--");
  });

  it("the default brand config claims no asset the template does not ship", () => {
    // Where this actually bit. Making the components conditional was not
    // enough: the DEFAULT config still named hero.webp, so the condition was
    // true and rendered a path to nothing. The source-level assertions above
    // all passed while the built HTML was still wrong.
    const cfg = src("brand.config.ts").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    expect(cfg).not.toContain("/brand/hero.webp");
    expect(cfg).not.toContain("/brand/corpus.webm");
    // The two that ARE shipped must keep their defaults.
    expect(cfg).toContain("/brand/logo.svg");
    expect(cfg).toContain("/brand/favicon.svg");
  });

  it("heroImage is optional in the brand type — a required field forces the fallback", () => {
    // This is the root cause: while `heroImage: string` was required, every
    // caller had to supply *something*, so a bogus path was the only option.
    expect(src("brand.config.ts")).toMatch(/heroImage\?:\s*string/);
  });
});
