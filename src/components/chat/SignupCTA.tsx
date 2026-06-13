import { SIGNUP_URL, LOGIN_URL } from "../../lib/divinci";
import { DEFAULT_LOCALE } from "../../i18n/locales";
import { getUI } from "../../i18n";

interface SignupCTAProps {
  lang?: string;
}

export function SignupCTA({ lang = DEFAULT_LOCALE }: SignupCTAProps) {
  const ui = getUI(lang);
  const t = ui.chat;
  return (
    <div className="rounded-2xl border border-df-green-dark/40 bg-df-green-leaf/15 p-5 text-center backdrop-blur-sm">
      <p className="text-base font-semibold text-df-text">{t.signupHeadline}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{t.signupBody}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          href={SIGNUP_URL}
          className="inline-flex items-center gap-2 rounded-full bg-df-green-dark px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-df-green-mid"
        >
          {t.signupButton}
          <span aria-hidden="true">→</span>
        </a>
        {/* Existing members log in instead. */}
        <a
          href={LOGIN_URL}
          className="inline-flex items-center rounded-full border border-df-green-dark/40 px-6 py-2.5 text-sm font-semibold text-df-green-dark transition hover:bg-df-green-dark/5"
        >
          {ui.hero.memberLoginCta}
        </a>
      </div>
    </div>
  );
}
