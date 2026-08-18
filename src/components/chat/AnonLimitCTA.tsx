import { DIVINCI_CHAT_URL } from "../../lib/divinci";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { CHAT_SYSTEM_STRINGS as SYS } from "../../i18n/chat-system-strings";

interface AnonLimitCTAProps {
  lang?: string;
}

/**
 * Shown when the API refuses with the release's anonymous-message cap.
 *
 * Distinct from <SignupCTA/> on purpose: that one fires on THIS page's free
 * message quota and sends the visitor to the customer's own site. This one
 * fires on a Divinci platform ceiling, so it sends them to Divinci.
 *
 * It renders a link rather than redirecting: a demo that navigates a
 * prospect's evaluator off the page without asking reads as a hijack, and
 * they lose the transcript they were reading.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AnonLimitCTA({ lang: _lang = DEFAULT_LOCALE }: AnonLimitCTAProps) {
  return (
    <div
      data-testid="anon-limit-cta"
      className="rounded-2xl border border-df-green-dark/40 bg-df-green-leaf/15 p-5 text-center backdrop-blur-sm"
    >
      <p className="text-base font-semibold text-df-text">
        {SYS.anonLimitHeadline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-df-muted-strong">
        {SYS.anonLimitBody}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          href={DIVINCI_CHAT_URL}
          className="inline-flex items-center gap-2 rounded-full bg-df-green-dark px-6 py-2.5 text-sm font-semibold text-df-on-chrome transition hover:bg-df-green-mid"
        >
          {SYS.anonLimitButton}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
