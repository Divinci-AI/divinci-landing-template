/**
 * Resend — REST client for sending transactional email.
 *
 * Replaces the v41 cf-email-send.ts integration. The Cloudflare
 * Email Sending API (open beta) refuses recipients at domains the
 * account doesn't own (error code 10202 "email.invalid") which makes
 * it unusable for a public visitor verification flow — every gmail /
 * outlook / proton visitor would get a `send_failed` log + no email.
 *
 * Resend's free tier covers 3000 emails / month — well above what a
 * preview-traffic landing page generates — and delivers to any
 * inbox without per-recipient verification.
 *
 * Endpoint: POST https://api.resend.com/emails
 * Auth:     Bearer <RESEND_API_KEY>
 *
 * Sender domain MUST be verified inside the Resend dashboard before
 * production traffic. For initial testing use the default sandbox
 * sender `onboarding@resend.dev` — that works without any DNS setup.
 *
 * Failure is NEVER surfaced to the visitor; the caller passes this
 * result to `ctx.waitUntil()` so the chat response is unaffected.
 */

export interface ResendEmailInput {
  apiKey: string;
  from: string;
  fromName?: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface ResendEmailResult {
  ok: boolean;
  status: number;
  /** Cloudflare-truncated body excerpt for logging. */
  bodyExcerpt: string;
  /** Resend's message id when ok, null otherwise. */
  messageId: string | null;
}

export async function sendResendEmail(
  input: ResendEmailInput,
): Promise<ResendEmailResult> {
  // Resend accepts either "from: address" or "from: Name <address>"
  // string form. Mirror the previous CF shape so the worker call
  // site doesn't need to change.
  const from = input.fromName
    ? `${input.fromName} <${input.from}>`
    : input.from;
  const payload: Record<string, unknown> = {
    from,
    to: [input.to],
    subject: input.subject,
    text: input.text,
  };
  if (input.html) payload.html = input.html;

  let resp: Response;
  try {
    resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return {
      ok: false,
      status: 0,
      bodyExcerpt: `network: ${err instanceof Error ? err.message : String(err)}`,
      messageId: null,
    };
  }

  // Safe text() + JSON.parse per CLAUDE.md — Resend can return HTML
  // 502/504 pages from its edge during incidents.
  const bodyText = await resp.text();
  let messageId: string | null = null;
  if (resp.ok) {
    try {
      const parsed = JSON.parse(bodyText) as { id?: unknown };
      if (typeof parsed.id === "string") messageId = parsed.id;
    } catch {
      // Resend returned 200 with non-JSON; treat as success without an id.
    }
  }
  return {
    ok: resp.ok,
    status: resp.status,
    bodyExcerpt: bodyText.slice(0, 500),
    messageId,
  };
}
