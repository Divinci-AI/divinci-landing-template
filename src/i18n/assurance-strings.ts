/**
 * System strings for the assurance section — what WE measured and what WE
 * protect, not what the customer sells.
 *
 * ⚠️ These deliberately do NOT live in `src/i18n/ui/en.ts`, for exactly the
 * reason set out in `chat-system-strings.ts`: that dictionary is the
 * per-customer COPY surface, the pipeline shape-checks each generated branded
 * `en.ts` against this template with EXACT key-set parity, and any key added
 * there is missing from every previously generated run — so the pipeline
 * rejects the branded copy wholesale and ships the demo with neutral "Acme
 * Expert" text in its title, og: tags, chat welcome and CTA.
 *
 * Every string here is identical on every demo. None of it is customer copy.
 *
 * English-only for now, the same honest trade the chat system strings make: to
 * translate them, add a per-locale map in THIS module — not a key over there.
 */
export const ASSURANCE_STRINGS = {
  heading: "How this assistant was tested",
  /** Deliberately plain. The point of the section is candour, not reassurance. */
  intro:
    "Every Divinci assistant is scored before anyone sees it, and the result is published here whether or not it flatters us.",

  qaHeading: "Quality assurance",
  qaScoreLabel: "overall score",
  qaCorrectnessLabel: "factual correctness",
  qaPassedLabel: "questions passed",
  /**
   * The composite averages correctness, relevance and completeness, and
   * near-perfect relevance can carry a weak correctness score upward — so
   * correctness is shown BESIDE it rather than folded into it. A single
   * headline number flatters, and this section exists to not do that.
   */
  qaMethod:
    "Scored on factual correctness, relevance and completeness against the site's own published content. Adversarial questions are written to make the assistant fail — to answer outside its sources, to give advice it should refuse, or to state something the site never says.",

  securityHeading: "Protections",
  /**
   * Each of these is a control that exists in the running product. Nothing
   * aspirational belongs in this list: the page is the evidence.
   */
  protections: [
    {
      title: "Answers only from published content",
      body: "The assistant retrieves from this site's own pages and cites what it used. It has no general knowledge to fall back on, so an answer with no source is an answer it does not give.",
    },
    {
      title: "Refuses what it should not answer",
      body: "Regulated questions — medical, legal, financial, or anything turning on an individual's circumstances — are routed to a human rather than answered.",
    },
    {
      title: "Bot and abuse protection",
      body: "Human verification runs before a conversation starts, and the verification is pinned server-side to the domains we serve, so a copy of this widget on another site cannot use it.",
    },
    {
      title: "Per-visitor limits",
      body: "Usage is capped per visitor, so a single party cannot exhaust the demo or run up its cost.",
    },
    {
      title: "Minimal data retention",
      body: "Email addresses are stored as a one-way hash and never written to logs. Global Privacy Control is honoured on the server, not just in the browser.",
    },
  ],

  redTeamHeading: "Adversarial red team",
  redTeamPassLabel: "attacks withstood",
  /**
   * Rendered ONLY when a run supplies red-team results. A demo that has not
   * been red-teamed shows nothing here — claiming an untested control is the
   * one failure this whole section exists to avoid.
   */
  redTeamMethod:
    "An independent adversarial suite attempts prompt injection, instruction override, source fabrication and disclosure of the system prompt.",
} as const;
