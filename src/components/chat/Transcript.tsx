import { cleanContextTitle } from "../../lib/clean-context-title";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from "react";

export interface TranscriptMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  pending?: boolean;
  /**
   * True for a user message that came from a conversation-starter pill.
   * Starter sends draw on a separate budget and don't count toward the
   * single free manual message, so the quota math excludes them.
   */
  isStarter?: boolean;
  /**
   * Deduped retrieved-source filenames (from the response's `context`
   * metadata.originalName) — rendered as chips above the assistant reply,
   * mirroring the static TranscriptShowcase.
   */
  sources?: string[];
  /**
   * Medical-safety advisory attached server-side when the release's
   * medicalSafety check flagged the reply (severity "severe" means the
   * server already rewrote the offending passage to a physician referral;
   * "review" means the LLM judge confirmed the topic warrants the notice).
   * Rendered as an amber banner under the reply bubble. The text comes
   * from the signed payload verbatim — never alter it client-side.
   */
  safetyAdvisory?: SafetyAdvisory;
}

export interface SafetyAdvisory {
  severity: "review" | "severe";
  text: string;
  categories?: string[];
}

export interface TranscriptFeedbackInput {
  sentiment?: -1 | 1;
  feedback?: string;
}

interface TranscriptProps {
  messages: TranscriptMessage[];
  /** Submit thumbs/feedback for the assistant reply at the given exchange index. */
  onFeedback?: (messageIndex: number, input: TranscriptFeedbackInput) => Promise<void>;
  /** The Release's uploaded avatar; falls back to the static logo when absent. */
  avatarUrl?: string | null;
}

export function Transcript({ messages, onFeedback, avatarUrl }: TranscriptProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const lastMsgRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll, scoped to the transcript scroller only (never the page):
  // - user message / pending dots → bottom, so the visitor sees the activity
  // - completed assistant reply  → TOP of that reply, so they read it from
  //   the beginning instead of landing at its end.
  const lastSig = (() => {
    const last = messages[messages.length - 1];
    if (!last) return "empty";
    return `${last.id}:${last.pending ? "pending" : "done"}:${last.content ? "c" : ""}`;
  })();
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const last = messages[messages.length - 1];
    if (last && last.role === "assistant" && !last.pending && last.content) {
      const el = lastMsgRef.current;
      if (el) {
        root.scrollTop +=
          el.getBoundingClientRect().top - root.getBoundingClientRect().top - 8;
      }
      return;
    }
    root.scrollTop = root.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSig]);

  // Map each completed assistant reply to its index in the signed anonymous
  // transcript (one entry per exchange) for feedback submission.
  const exchangeIndexById = new Map<string, number>();
  let seq = 0;
  for (const m of messages) {
    if (m.role === "assistant" && !m.pending && m.content) {
      exchangeIndexById.set(m.id, seq++);
    }
  }

  return (
    <div
      ref={rootRef}
      className="df-chat-scroll flex max-h-[26rem] flex-col gap-5 overflow-y-auto px-1 md:max-h-[32rem]"
      role="log"
      aria-live="polite"
    >
      {messages.map((m, i) => (
        <div key={m.id} ref={i === messages.length - 1 ? lastMsgRef : undefined}>
          {m.role === "user" ? (
            <UserBubble content={m.content} />
          ) : (
            <AssistantTurn
              content={m.content}
              pending={m.pending}
              sources={m.sources}
              messageIndex={exchangeIndexById.get(m.id)}
              onFeedback={onFeedback}
              avatarUrl={avatarUrl}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function DfAvatar({ avatarUrl }: { avatarUrl?: string | null }) {
  return (
    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-df-green-leaf/20 ring-1 ring-df-green-dark/15">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" aria-hidden="true" className="h-full w-full object-cover" />
      ) : (
        <img src="/drfuhrman-logo.svg" alt="" aria-hidden="true" className="h-4 w-4" width={16} height={16} />
      )}
    </span>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[88%] rounded-2xl rounded-br-sm bg-df-green-dark px-4 py-2.5 text-left text-sm font-medium text-white md:text-base">
        {content}
      </p>
    </div>
  );
}

/** How many source chips to keep visible (scrollable) before offering "Show all". */
const SOURCE_TOGGLE_THRESHOLD = 3;
/** How long a citation-clicked source chip stays highlighted (ms). */
const SOURCE_HIGHLIGHT_MS = 2600;

function AssistantTurn({
  content,
  pending,
  sources,
  messageIndex,
  onFeedback,
  avatarUrl,
}: {
  content: string;
  pending?: boolean;
  sources?: string[];
  messageIndex?: number;
  onFeedback?: (messageIndex: number, input: TranscriptFeedbackInput) => Promise<void>;
  avatarUrl?: string | null;
}) {
  // Which source chip is currently highlighted (0-based index), set when a
  // citation is clicked. Cleared after a short flash.
  const [highlight, setHighlight] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const chipRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click a `[[n]]` citation → highlight + scroll the n-th source chip into
  // view. Works in both the collapsed (one-row, horizontally scrollable) and
  // expanded (wrapped) layouts.
  const handleCite = useCallback(
    (n: number) => {
      const count = sources?.length ?? 0;
      if (count === 0) return;
      const idx = Math.min(Math.max(n - 1, 0), count - 1);
      setHighlight(idx);
      if (clearTimer.current) clearTimeout(clearTimer.current);
      clearTimer.current = setTimeout(() => setHighlight(null), SOURCE_HIGHLIGHT_MS);
    },
    [sources],
  );

  // Bring the highlighted chip into view WITHOUT ever scrolling the page:
  // scrollIntoView walks every scrollable ancestor (including the window),
  // which made citation clicks "scroll into the chat somewhere". Instead,
  // scroll exactly two containers ourselves: the chip strip horizontally
  // (centering the chip in collapsed one-row mode) and the transcript
  // scroller vertically (so the chips row above the answer is visible).
  useEffect(() => {
    if (highlight === null) return;
    const chip = chipRefs.current[highlight];
    if (!chip) return;
    // Instant (non-smooth) jumps land exactly: concurrent smooth scrolls were
    // getting interrupted and stopping partway ("scrolls up a little but not
    // all the way to the context bubble").
    const scroller = chip.closest(".df-chat-scroll") as HTMLElement | null;
    if (scroller) {
      const delta =
        chip.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top -
        16;
      if (Math.abs(delta) > 4) scroller.scrollTop += delta;
    }
    const strip = chip.parentElement;
    if (strip && strip.scrollWidth > strip.clientWidth) {
      strip.scrollLeft = Math.max(
        0,
        chip.getBoundingClientRect().left -
          strip.getBoundingClientRect().left +
          strip.scrollLeft -
          strip.clientWidth / 2 +
          chip.clientWidth / 2,
      );
    }
  }, [highlight, expanded]);

  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    },
    [],
  );

  return (
    <div className="flex flex-col gap-1.5">
      {sources && sources.length > 0 && (
        <SourceChips
          sources={sources}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          highlight={highlight}
          chipRefs={chipRefs}
        />
      )}
      <div className="flex items-start gap-2">
        <DfAvatar avatarUrl={avatarUrl} />
        <div className="max-w-[88%] space-y-2 rounded-2xl rounded-tl-sm bg-df-green-leaf/15 px-4 py-3 text-sm leading-relaxed text-df-text shadow-sm md:text-base">
          {content ? (
            renderRichText(content, { sources, onCite: handleCite })
          ) : pending ? (
            <ThinkingDots />
          ) : null}
          {pending && content && <BlinkingCursor />}
        </div>
      </div>
      {content && !pending && onFeedback && messageIndex !== undefined && (
        <MessageRating messageIndex={messageIndex} onFeedback={onFeedback} />
      )}
    </div>
  );
}

function MessageRating({
  messageIndex,
  onFeedback,
}: {
  messageIndex: number;
  onFeedback: (messageIndex: number, input: TranscriptFeedbackInput) => Promise<void>;
}) {
  const [vote, setVote] = useState<-1 | 1 | 0>(0);
  const [showBox, setShowBox] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="pl-9 text-xs text-gray-500">Thanks for your feedback 🙏</p>;
  }

  const thumb = (on: boolean) =>
    `rounded-md border px-1.5 py-0.5 text-sm transition ${
      on
        ? "border-df-green-dark bg-df-green-dark text-white"
        : "border-df-green-dark/20 bg-white/70 text-gray-600 hover:border-df-green-dark/40"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1.5 pl-9">
      <button
        type="button"
        aria-label="Helpful"
        className={thumb(vote === 1)}
        onClick={() => {
          // Positive votes are a server-side no-op for anonymous chat
          // (negative-only); this is a local acknowledgement.
          setVote(1);
          setShowBox(false);
        }}
      >
        👍
      </button>
      <button
        type="button"
        aria-label="Not helpful"
        className={thumb(vote === -1)}
        onClick={() => {
          setVote(-1);
          setShowBox(true);
        }}
      >
        👎
      </button>
      {showBox && (
        <form
          className="mt-1 flex w-full flex-col gap-1.5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitting) return;
            setSubmitting(true);
            try {
              await onFeedback(messageIndex, {
                sentiment: -1,
                feedback: text.trim() || undefined,
              });
              setDone(true);
            } catch {
              setSubmitting(false);
            }
          }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            rows={2}
            placeholder="What was wrong? (optional)"
            className="w-full rounded-lg border border-df-green-dark/15 bg-white px-3 py-2 text-sm text-df-text focus:border-df-green-dark/40 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-df-green-dark px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send feedback"}
            </button>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
              onClick={() => setShowBox(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/**
 * Retrieved-source chips ("context bubbles"). Collapsed by default to a SINGLE
 * row — the chips sit in a horizontally-scrollable strip (no visible
 * scrollbar) so a long source list never balloons the reply to several rows.
 * A "Show all N sources" toggle expands them to a wrapped grid. A chip
 * highlights (and scrolls into view) when its `[[n]]` citation is clicked.
 */
function SourceChips({
  sources,
  expanded,
  onToggle,
  highlight,
  chipRefs,
}: {
  sources: string[];
  expanded: boolean;
  onToggle: () => void;
  highlight: number | null;
  chipRefs: MutableRefObject<Array<HTMLSpanElement | null>>;
}) {
  return (
    <div className="pl-9">
      <div
        className={
          expanded
            ? "flex flex-wrap items-center gap-1.5"
            : "flex flex-nowrap items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        }
      >
        {sources.map((s, i) => (
          <span
            key={`${s}-${i}`}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            title={cleanContextTitle(s)}
            className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs transition ${
              highlight === i
                ? "border-df-green-dark bg-df-green-leaf/40 text-df-green-dark ring-2 ring-df-green-dark/50"
                : "border-df-green-dark/15 bg-white/80 text-gray-600"
            }`}
          >
            <span className="text-[0.7rem] font-semibold text-df-green-dark/70" aria-hidden="true">
              {i + 1}
            </span>
            <span aria-hidden="true">{sourceIcon(s)}</span>
            <span className="max-w-[10rem] truncate">{cleanContextTitle(s)}</span>
          </span>
        ))}
      </div>
      {sources.length > SOURCE_TOGGLE_THRESHOLD && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          // preventDefault on mousedown: clicking a partially-offscreen button
          // otherwise focuses it and the browser auto-scrolls it into view
          // BEFORE mouseup — the target moves and the click never fires (the
          // "first click just scrolls the page" bug).
          onMouseDown={(e) => e.preventDefault()}
          className="mt-1 text-xs font-medium text-df-green-dark/80 transition hover:text-df-green-dark"
        >
          {expanded ? "Collapse sources" : `Show all ${sources.length} sources`}
        </button>
      )}
    </div>
  );
}

function sourceIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "txt") return "📑";
  if (ext === "html" || ext === "htm") return "🌐";
  return "📄";
}

/** Resolve a citation number to its source ("context") title for the tooltip. */
function citeTitle(sources: string[] | undefined, n: number): string {
  if (!sources || sources.length === 0) return "Dr. Fuhrman's corpus";
  return cleanContextTitle(sources[n - 1] ?? sources[sources.length - 1]);
}

interface InlineOpts {
  sources?: string[];
  onCite?: (n: number) => void;
}

/** A `[[n]]` citation: a superscript number with a hover/focus source tooltip;
 *  clicking it highlights + scrolls to the matching source chip. */
function Citation({ n, sources, onCite }: { n: number } & InlineOpts) {
  const title = citeTitle(sources, n);
  const activate = () => onCite?.(n);
  return (
    <sup
      role="button"
      tabIndex={0}
      aria-label={`Source ${n}: ${title}`}
      onClick={(e) => {
        e.stopPropagation();
        activate();
      }}
      onMouseDown={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
      className="df-cite group relative ml-0.5 cursor-pointer rounded bg-df-green-leaf/30 px-1 py-0.5 text-[0.65em] font-semibold text-df-green-dark transition hover:bg-df-green-leaf/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-df-green-dark"
    >
      {n}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 hidden w-max max-w-[15rem] -translate-x-1/2 whitespace-normal rounded-md bg-df-text px-2.5 py-1.5 text-left text-xs font-normal not-italic leading-snug text-white shadow-lg group-hover:block group-focus-within:block"
      >
        {title}
      </span>
    </sup>
  );
}

// Lightweight inline formatter — mirrors the static showcase's mini-syntax
// so the live reply renders **bold** / *italic* / [[n]] citations instead of
// raw markup, split into paragraphs on blank lines. Deliberately small (no
// markdown dependency); anything it doesn't recognise renders as plain text.
function renderRichText(text: string, opts?: InlineOpts): ReactNode {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((para, i) => <p key={i}>{renderInline(para, opts)}</p>);
}

function renderInline(s: string, opts?: InlineOpts): ReactNode[] {
  const out: ReactNode[] = [];
  // First pass: bold / italic spans. Their CONTENT is run through the
  // citation pass too — refs inside **bold**/*italic* used to fall out as
  // dead text because the bold branch pushed its capture as a plain string.
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(...renderCitations(s.slice(last, m.index), key, opts));
    key += 100; // keep keys unique across segments
    if (m[1] !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold">
          {renderCitations(m[1], key + 1, opts)}
        </strong>,
      );
      key += 100;
    } else if (m[2] !== undefined) {
      out.push(<em key={key++}>{renderCitations(m[2], key + 1, opts)}</em>);
      key += 100;
    }
    last = re.lastIndex;
  }
  if (last < s.length) out.push(...renderCitations(s.slice(last), key, opts));
  return out;
}

/**
 * Citation pass: every bracket ref becomes an interactive circle — singular
 * `[7]`, grouped `[2, 8]`, ranges `[4-6]` (endpoints), and the static
 * showcase's `[[n]]`. A bare bracket ref as text is the old, dead-looking
 * fallback we never want.
 */
function renderCitations(s: string, keyBase: number, opts?: InlineOpts): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\[\[(\d+)\]\]|\[(\d+(?:\s*[,\u2013-]\s*\d+)*)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = keyBase;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const nums = (m[1] ?? m[2] ?? "")
      .split(/[,\u2013-]/)
      .map((part) => Number(part.trim()))
      .filter((n) => Number.isInteger(n) && n > 0);
    nums.forEach((n) => {
      out.push(
        <Citation key={key++} n={n} sources={opts?.sources} onCite={opts?.onCite} />,
      );
    });
    last = re.lastIndex;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-end gap-1" aria-label="Thinking">
      <span className="h-2 w-2 animate-bounce rounded-full bg-df-green-dark/40 [animation-delay:-0.32s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-df-green-dark/40 [animation-delay:-0.16s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-df-green-dark/40" />
    </span>
  );
}

function BlinkingCursor() {
  return (
    <span
      className="ml-0.5 inline-block h-4 w-px animate-pulse bg-df-text/60 align-middle"
      aria-hidden="true"
    />
  );
}
