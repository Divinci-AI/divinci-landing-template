import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

/**
 * iOS Safari ZOOMS the page when a focused input's font-size is under 16px,
 * and does not zoom back out. On the Acme Realty demo that made the chat field
 * unusable on a phone: you could not see what you were typing.
 *
 * `text-sm` is 14px. Every real TEXT-ENTRY field therefore has to be >=16px at
 * mobile widths — `text-base md:text-sm` keeps the 14px desktop design.
 *
 * The other "fix" — <meta viewport maximum-scale=1> — is an accessibility
 * regression: it disables pinch-zoom for everyone to work around one field.
 */
const FIELD_FILES = [
  "src/components/chat/MessageInput.tsx",
  "src/components/chat/StickyChatBar.tsx",
  "src/components/chat/Transcript.tsx",
];

describe("mobile: focusable text fields must not trigger iOS auto-zoom", () => {
  it.each(FIELD_FILES)("%s has no sub-16px text field", (f) => {
    const src = readFileSync(f, "utf8");
    // A field is a class string carrying `text-sm`/`text-xs` AND a focus: rule.
    // Buttons never take focus-zoom, so they are deliberately not matched.
    const offenders = (src.match(/"[^"]*\btext-(?:sm|xs)\b[^"]*focus:[^"]*"/g) ?? [])
      .filter((c) => !/md:text-(?:sm|xs)/.test(c));
    expect(offenders, `sub-16px focusable field(s):\n${offenders.join("\n")}`).toEqual([]);
  });

  it("does not disable pinch-zoom in the viewport meta", () => {
    const layout = readFileSync("src/layouts/Landing.astro", "utf8");
    expect(layout).not.toMatch(/maximum-scale\s*=\s*1/);
    expect(layout).not.toMatch(/user-scalable\s*=\s*no/);
  });
});
