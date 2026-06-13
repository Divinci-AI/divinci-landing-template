import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { SIGNUP_URL, LOGIN_URL } from "../../lib/divinci";
import { scrollToHeroChat } from "../../lib/scroll-to-hero";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { getUI } from "../../i18n";

const MAX_MESSAGE_LEN = 2000;

interface StickyChatBarProps {
  lang?: string;
  /** Whether the email gate (which lives only in the hero) is still open. */
  emailRequired: boolean;
  draft: string;
  onDraftChange: (s: string) => void;
  onSend: (text: string) => void;
  pending: boolean;
  /** True once the visitor has spent their free message — swap the input for
   *  a compact sign-up nudge instead of an unusable field. */
  quotaExhausted: boolean;
}

export function StickyChatBar({
  lang = DEFAULT_LOCALE,
  emailRequired,
  draft,
  onDraftChange,
  onSend,
  pending,
  quotaExhausted,
}: StickyChatBarProps) {
  const ui = getUI(lang);
  const t = ui.chat;
  // `visible` is driven by IntersectionObservers: the bar slides up once the
  // hero (which has its own input + the email gate) scrolls out of view, and
  // hides again as the footer approaches so it never overlaps it.
  const [heroPast, setHeroPast] = useState(false);
  const [footerNear, setFooterNear] = useState(false);
  // The static transcript showcase has its OWN composer; showing the sticky
  // bar over it produces a confusing double input. Hide the sticky bar while
  // that section is on screen (clicking the showcase scrolls up to the real
  // hero input anyway).
  const [showcaseNear, setShowcaseNear] = useState(false);
  const visible = heroPast && !footerNear && !showcaseNear;
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const footer = document.querySelector("footer");
    const showcase = document.getElementById("transcripts");
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const io = new IntersectionObserver(
        ([entry]) => setHeroPast(entry.intersectionRatio < 0.12),
        { threshold: [0, 0.12, 0.5, 1] },
      );
      io.observe(hero);
      observers.push(io);
    }
    if (footer) {
      const io = new IntersectionObserver(
        ([entry]) => setFooterNear(entry.isIntersecting),
        { rootMargin: "0px 0px 160px 0px" },
      );
      io.observe(footer);
      observers.push(io);
    }
    if (showcase) {
      const io = new IntersectionObserver(
        ([entry]) => setShowcaseNear(entry.isIntersecting),
        // Trigger a bit before it fully enters so the bars never co-exist.
        { rootMargin: "0px 0px 120px 0px" },
      );
      io.observe(showcase);
      observers.push(io);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollToHero() {
    scrollToHeroChat();
  }

  // A single composer. The email gate lives ONLY in the hero, so if it's
  // still open we just carry the (shared) draft up and scroll there for the
  // visitor to enter their email; otherwise we send and scroll up to watch
  // the reply stream in.
  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || pending || trimmed.length > MAX_MESSAGE_LEN) return;
    if (emailRequired) {
      scrollToHero();
      return;
    }
    onSend(trimmed);
    onDraftChange("");
    scrollToHero();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  const sendActive = !pending && draft.trim().length > 0;

  return (
    <div
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-50 transition-all duration-500 ease-out ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-3xl px-4 pb-3 sm:pb-4">
        <div className="rounded-2xl border border-df-green-dark/20 bg-df-cream/85 p-3 shadow-[0_-8px_40px_rgba(59,107,63,0.18)] backdrop-blur-xl sm:p-4">
          {quotaExhausted ? (
            // Free message spent — nudge to sign up instead of a dead field.
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
              <p className="text-center text-sm font-medium text-df-text sm:text-left">
                {t.quotaExhaustedNudge}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={LOGIN_URL}
                  className="inline-flex items-center rounded-full border border-df-green-dark/40 px-4 py-2 text-sm font-semibold text-df-green-dark transition hover:bg-df-green-dark/5"
                >
                  {ui.hero.memberLoginCta}
                </a>
                <a
                  href={SIGNUP_URL}
                  className="inline-flex items-center gap-2 rounded-full bg-df-green-dark px-5 py-2 text-sm font-semibold text-white transition hover:bg-df-green-mid"
                >
                  {t.signupButton}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={MAX_MESSAGE_LEN}
                aria-label={t.questionAriaLabel}
                placeholder={t.questionPlaceholderSticky}
                className="min-w-0 flex-1 rounded-full border border-gray-300 bg-white/80 px-4 py-2.5 text-sm focus:border-df-green-dark focus:outline-none focus:ring-2 focus:ring-df-green-dark/30"
              />
              <span className={`send-glow-wrap ${sendActive ? "is-active" : ""}`}>
                <button
                  type="submit"
                  disabled={pending || !draft.trim()}
                  aria-label={t.sendAriaLabel}
                  className="rounded-full bg-df-green-dark/90 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-df-green-mid disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {pending ? "…" : t.askButton}
                </button>
              </span>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
