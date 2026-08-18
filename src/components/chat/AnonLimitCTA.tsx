import { DIVINCI_CHAT_URL } from "../../lib/divinci";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { getUI } from "../../i18n";
import { en } from "../../i18n/ui/en";

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
export function AnonLimitCTA({ lang = DEFAULT_LOCALE }: AnonLimitCTAProps) {
  const t = getUI(lang).chat;
  return (
    <div
      data-testid="anon-limit-cta"
      className="rounded-2xl border border-df-green-dark/40 bg-df-green-leaf/15 p-5 text-center backdrop-blur-sm"
    >
      <p className="text-base font-semibold text-df-text">
        {t.anonLimitHeadline ?? en.chat.anonLimitHeadline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-df-muted-strong">
        {t.anonLimitBody ?? en.chat.anonLimitBody}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          href={DIVINCI_CHAT_URL}
          className="inline-flex items-center gap-2 rounded-full bg-df-green-dark px-6 py-2.5 text-sm font-semibold text-df-on-chrome transition hover:bg-df-green-mid"
        >
          {t.anonLimitButton ?? en.chat.anonLimitButton}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  );
}
