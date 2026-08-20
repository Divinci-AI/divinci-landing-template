import { SIGNUP_URL, LOGIN_URL } from "../../lib/divinci";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { getUI } from "../../i18n";
import { brand } from "../../brand.config";

interface SignupCTAProps {
  lang?: string;
}

export function SignupCTA({ lang = DEFAULT_LOCALE }: SignupCTAProps) {
  const ui = getUI(lang);
  const t = ui.chat;
  return (
    // `data-testid` rather than a class or the visible headline: every class
    // here is brand-themable and the headline is brand COPY, so a test bound to
    // either breaks on the next demo. Same reasoning as `sendButton`'s
    // accessible-name locator in tests/e2e/fixtures.ts.
    <div
      data-testid="signup-cta"
      className="rounded-2xl border border-df-green-dark/40 bg-df-green-leaf/15 p-5 text-center backdrop-blur-sm"
    >
      <p className="text-base font-semibold text-df-text">{t.signupHeadline}</p>
      <p className="mt-2 text-sm leading-relaxed text-df-muted-strong">{t.signupBody}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          href={SIGNUP_URL}
          className="inline-flex items-center gap-2 rounded-full bg-df-green-dark px-6 py-2.5 text-sm font-semibold text-df-on-chrome transition hover:bg-df-green-mid"
        >
          {t.signupButton}
          <span aria-hidden="true">→</span>
        </a>
        {/* Existing members log in instead — only when the client has a login. */}
        {brand.links.hasLogin && (
          <a
            href={LOGIN_URL}
            className="inline-flex items-center rounded-full border border-df-green-dark/40 px-6 py-2.5 text-sm font-semibold text-df-brand-ink transition hover:bg-df-green-dark/5"
          >
            {ui.hero.memberLoginCta}
          </a>
        )}
      </div>
    </div>
  );
}
