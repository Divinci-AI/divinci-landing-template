import { createClient, type DivinciClient } from "@divinci-ai/client";
import { brand, FREE_MESSAGE_QUOTA, FREE_MESSAGES_BEFORE_EMAIL } from "../brand.config";
import { withRef } from "./links";

// All per-customer values are sourced from src/brand.config.ts — do not
// hardcode constants here.
export const API_BASE = brand.divinci.apiBase;
export const WHITELABEL_ID = brand.divinci.whitelabelId;
export const RELEASE_ID = brand.divinci.releaseId;

// Anonymous-visitor quota: how many user messages before the upgrade gate,
// and how many of those need no email address at all.
export { FREE_MESSAGE_QUOTA, FREE_MESSAGES_BEFORE_EMAIL };

// Where to send users after they've exhausted the free quota. Tagged via
// withRef() so the customer can attribute landing-page signups in analytics.
export const SIGNUP_URL = withRef(brand.links.signupUrl, "free-message-quota-cta");
export const LOGIN_URL = withRef(brand.links.loginUrl, "free-message-quota-cta");

/**
 * Where a visitor goes when the DIVINCI-side anonymous cap is reached
 * (release.maxAnonymousChatMessages), as opposed to this page's own free-
 * message quota. Deliberately NOT brand.links.* — that points at the
 * customer's site, and this ceiling is Divinci's, not theirs.
 *
 * withRef() is intentionally NOT applied: it tags with the CUSTOMER's
 * utm_source, which would misattribute a Divinci signup to them.
 */
export const DIVINCI_CHAT_URL =
  "https://chat.divinci.app/?utm_source=divinci-demo&utm_medium=referral&utm_campaign=anon-limit-cta";

let cached: DivinciClient | null = null;

export function getDivinci(): DivinciClient {
  if (!cached) {
    cached = createClient({
      releaseId: RELEASE_ID,
      baseUrl: API_BASE,
    });
  }
  return cached;
}

export interface ReleaseConfig {
  welcomeMessage: string | null;
  starters: string[];
}

// Fallback shown only if the live Release config fetch fails.
export const FALLBACK_RELEASE: ReleaseConfig = {
  welcomeMessage: brand.chat.fallbackWelcome,
  starters: brand.chat.starters,
};
