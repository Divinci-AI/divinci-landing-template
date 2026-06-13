/**
 * UTM tagging helper for outbound links.
 *
 * Every link that leaves drfuhrman.ai for one of our own properties
 * (drfuhrman.com, divinci.ai) goes through `withRef()` so the receiving
 * site can attribute traffic back to this landing page in its analytics.
 *
 * Tag set:
 *   utm_source   = drfuhrman-ai
 *   utm_medium   = referral
 *   utm_campaign = <optional, per-link>
 *
 * If the URL already has query params, the UTM keys are merged in
 * (existing keys with the same name win, so a hand-written ?utm_campaign
 * on the source URL isn't clobbered).
 */
export const REF_SOURCE = "drfuhrman-ai";
export const REF_MEDIUM = "referral";

export function withRef(rawUrl: string, campaign?: string): string {
  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.has("utm_source")) {
      url.searchParams.set("utm_source", REF_SOURCE);
    }
    if (!url.searchParams.has("utm_medium")) {
      url.searchParams.set("utm_medium", REF_MEDIUM);
    }
    if (campaign && !url.searchParams.has("utm_campaign")) {
      url.searchParams.set("utm_campaign", campaign);
    }
    return url.toString();
  } catch {
    // Not a valid URL (e.g. a mailto: or relative href) — pass through.
    return rawUrl;
  }
}
