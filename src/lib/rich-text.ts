/**
 * Parse a live chat reply into a tiny document tree that Transcript.tsx
 * renders. Pure and dependency-free so it can be unit-tested in node.
 *
 * WHY THIS EXISTS (2026-09-28 prospect rehearsal). The previous formatter
 * handled **bold**, *italic* and [n] citations on one paragraph at a time, and
 * three ordinary model outputs came out broken on live demos:
 *
 *   1. A "* " bullet list. The italic rule `*…*` paired the FIRST bullet's
 *      marker with the SECOND's, so item one rendered in italics, the markers
 *      vanished, and a stray "*" was left before item three. Every list read as
 *      run-on prose.
 *   2. `[About Us](https://…)` — no link support, so the raw markdown showed.
 *   3. Single newlines inside a paragraph collapsed into spaces.
 *
 * So lists are recognised BEFORE inline parsing (a list marker can never be
 * read as emphasis), italics need the marker to hug a word, and links are
 * real links — http(s) only; anything else stays text.
 *
 * Still deliberately small: no HTML passthrough, no images, no tables. What it
 * does not recognise renders as plain text, which React escapes.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "link"; href: string; c: Inline[] }
  | { t: "cite"; n: number[] };

export type Block =
  | { t: "p"; lines: Inline[][] }
  | { t: "h"; c: Inline[] }
  | { t: "ul"; items: Inline[][] }
  | { t: "ol"; start: number; items: Inline[][] };

const BULLET = /^\s*[*\-•]\s+(.*)$/;
const ORDERED = /^\s*(\d{1,3})[.)]\s+(.*)$/;
const HEADING = /^\s*#{1,6}\s+(.*)$/;

export function parseRichText(text: string): Block[] {
  const blocks: Block[] = [];
  const paragraphs = text.replace(/\r\n/g, "\n").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  for (const para of paragraphs) {
    let lines: Inline[][] = [];
    const flush = () => { if (lines.length) { blocks.push({ t: "p", lines }); lines = []; } };
    for (const line of para.split("\n")) {
      const b = line.match(BULLET);
      const o = line.match(ORDERED);
      const h = line.match(HEADING);
      if (b || o) {
        flush();
        // Continue the list only if it is the block immediately before this line.
        const prev = blocks[blocks.length - 1];
        if (b && prev?.t === "ul") prev.items.push(parseInline(b[1]));
        else if (b) blocks.push({ t: "ul", items: [parseInline(b[1])] });
        else if (prev?.t === "ol") prev.items.push(parseInline(o![2]));
        else blocks.push({ t: "ol", start: Number(o![1]), items: [parseInline(o![2])] });
      } else if (h) {
        flush();
        blocks.push({ t: "h", c: parseInline(h[1]) });
      } else if (line.trim()) {
        lines.push(parseInline(line.trim()));
      }
    }
    flush();
  }
  return blocks;
}

// Order matters: a markdown link before a citation (both start with "["), bold
// before italic, and a bare URL last.
const INLINE = new RegExp(
  [
    String.raw`\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)`, // 1,2 link
    String.raw`\*\*([^*\n]+?)\*\*`, // 3 bold
    String.raw`(?<![\w*])\*(?=\S)([^*\n]+?)(?<=\S)\*(?![\w*])`, // 4 italic, hugging a word
    String.raw`(?<![\w(])(https?:\/\/[^\s<>()\]]+)`, // 5 bare URL
  ].join("|"),
  "g",
);

export function parseInline(s: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  const re = new RegExp(INLINE.source, "g"); // fresh per call: parseInline recurses via parseCitations
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(...parseCitations(s.slice(last, m.index)));
    if (m[1] !== undefined) out.push({ t: "link", href: m[2], c: parseCitations(m[1]) });
    else if (m[3] !== undefined) out.push({ t: "strong", c: parseCitations(m[3]) });
    else if (m[4] !== undefined) out.push({ t: "em", c: parseCitations(m[4]) });
    else if (m[5] !== undefined) {
      // A sentence-ending "." or ")" belongs to the sentence, not the URL.
      const url = m[5].replace(/[.,;:!?]+$/, "");
      out.push({ t: "link", href: url, c: [{ t: "text", v: url }] });
      re.lastIndex = m.index + url.length;
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(...parseCitations(s.slice(last)));
  return out;
}

/** `[7]`, `[2, 8]`, `[4-6]` (endpoints) and the showcase's `[[n]]`. */
export function parseCitations(s: string): Inline[] {
  const out: Inline[] = [];
  const re = /\[\[(\d+)\]\]|\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push({ t: "text", v: s.slice(last, m.index) });
    const n = (m[1] ?? m[2] ?? "").split(/[,–-]/).map((p) => Number(p.trim())).filter((x) => Number.isInteger(x) && x > 0);
    if (n.length) out.push({ t: "cite", n });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ t: "text", v: s.slice(last) });
  return out;
}
