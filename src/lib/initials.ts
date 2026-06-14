/** Short, legible avatar initials from a brand/site name.
 *  "MD Spine Care" → "MD" (keeps a leading acronym); "Acme Health" → "AH". */
export function brandInitials(name: string): string {
  const clean = (name || "")
    .replace(/\(.*?\)/g, " ") // drop "(Dr. …)" parentheticals
    .replace(/\b(AI|the|of|and|&)\b/gi, " ")
    .trim();
  if (!clean) return "AI";
  const words = clean.split(/\s+/).filter(Boolean);
  // A leading short acronym (e.g. "MD", "UCSF") is the natural mark.
  if (/^[A-Z0-9]{2,4}$/.test(words[0])) return words[0];
  return words.slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
