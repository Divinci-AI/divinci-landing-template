import { describe, expect, it } from "vitest";
import { parseInline, parseRichText, type Block, type Inline } from "./rich-text";

const text = (xs: Inline[]): string =>
  xs.map((x) => (x.t === "text" ? x.v : x.t === "cite" ? `[${x.n.join(",")}]` : "c" in x ? text(x.c) : "")).join("");

describe("parseRichText — outputs captured from live demos on 2026-09-28", () => {
  it("renders a '* ' bullet list as a list, not as italics across items (OrthoCincy)", () => {
    const reply =
      "Our doctors who specialize in knee replacement are:\n" +
      "* Dr. Jonathon M. Spanyer: board-certified, knee replacement [2].\n" +
      "* Dr. Shankar Narayanan: hip and knee surgery [3].\n" +
      "* Dr. Matthew S. Grunkemeyer: joint replacement [4].";
    const blocks = parseRichText(reply);
    expect(blocks.map((b) => b.t)).toEqual(["p", "ul"]);
    const ul = blocks[1] as Extract<Block, { t: "ul" }>;
    expect(ul.items).toHaveLength(3);
    expect(text(ul.items[2])).toBe("Dr. Matthew S. Grunkemeyer: joint replacement [4].");
    // no item is italicised and no raw marker survives
    expect(JSON.stringify(blocks)).not.toContain('"em"');
    expect(JSON.stringify(blocks)).not.toMatch(/"v":"[^"]*\* /);
    // citations inside list items still become citations
    expect(ul.items[0].some((x) => x.t === "cite")).toBe(true);
  });

  it("renders [About Us](url) as a link, not raw markdown (Diet Doctor)", () => {
    const inl = parseInline("please visit our [About Us](https://www.dietdoctor.com/about) page or contact us.");
    const link = inl.find((x) => x.t === "link") as Extract<Inline, { t: "link" }>;
    expect(link.href).toBe("https://www.dietdoctor.com/about");
    expect(text(link.c)).toBe("About Us");
    expect(text(inl)).not.toContain("](");
  });

  it("numbered lists keep their start number", () => {
    const [ol] = parseRichText("3. third\n4. fourth") as [Extract<Block, { t: "ol" }>];
    expect(ol).toMatchObject({ t: "ol", start: 3 });
    expect(ol.items).toHaveLength(2);
  });

  it("keeps single line breaks inside a paragraph", () => {
    const [p] = parseRichText("Mon-Fri 8am-5pm\nSat 9am-1pm") as [Extract<Block, { t: "p" }>];
    expect(p.lines).toHaveLength(2);
  });
});

describe("parseInline — what must NOT change", () => {
  it("still does **bold**, *italic* and [n] citations", () => {
    const inl = parseInline("**Keto** is *very* low-carb [1, 3].");
    expect(inl.map((x) => x.t)).toEqual(["strong", "text", "em", "text", "cite", "text"]);
  });
  it("does not italicise arithmetic or loose asterisks", () => {
    expect(parseInline("5 * 3 = 15 and 2 * 4 = 8").every((x) => x.t === "text")).toBe(true);
  });
  it("never links a non-http scheme", () => {
    const inl = parseInline("[click](javascript:alert(1)) and [x](data:text/html,hi)");
    expect(inl.some((x) => x.t === "link")).toBe(false);
  });
  it("links a bare URL without swallowing the sentence's full stop", () => {
    const inl = parseInline("See https://example.com/pricing.");
    const link = inl.find((x) => x.t === "link") as Extract<Inline, { t: "link" }>;
    expect(link.href).toBe("https://example.com/pricing");
    expect(text(inl)).toBe("See https://example.com/pricing.");
  });
});
