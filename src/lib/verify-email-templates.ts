/**
 * Templates for the Phase 4 magic-link verification email and the
 * landing pages the link redirects to.
 *
 * Kept text-mostly per the goal doc: single CTA, minimal HTML. Avoids
 * phishing-look pitfalls (no logos hotlinked from imgur, no unrelated
 * tracking pixels).
 *
 * The HTML is rendered as a string by the worker; no JSX/template
 * engine pulled into the bundle.
 */

export interface VerifyEmailContext {
  verifyUrl: string;
  ttlHours: number;
}

export function renderVerifyEmailText({
  verifyUrl,
  ttlHours,
}: VerifyEmailContext): string {
  return [
    `Welcome to DrFurman.ai.`,
    ``,
    `Click the link below to confirm your email and unlock`,
    `5 more messages over the next 24 hours.`,
    ``,
    verifyUrl,
    ``,
    `This link expires in ${ttlHours} hours. If you didn't request`,
    `this email, you can safely ignore it — no further action`,
    `is needed.`,
    ``,
    `— The DrFurman.ai team`,
  ].join("\n");
}

export function renderVerifyEmailHtml({
  verifyUrl,
  ttlHours,
}: VerifyEmailContext): string {
  // Inline styles only — most email clients strip <style> blocks.
  // No external resources (no <img>, no remote CSS).
  return `<!doctype html>
<html><body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#0a0a0a;color:#e8e8e8;margin:0;padding:32px 16px;">
<div style="max-width:520px;margin:0 auto;background:#141414;border-radius:16px;padding:32px;border:1px solid #2a2a2a;">
<h1 style="font-size:24px;margin:0 0 16px;color:#fff;">Welcome to DrFurman.ai</h1>
<p style="line-height:1.6;margin:0 0 16px;">Click the button below to confirm your email and unlock <strong>5 more messages over the next 24 hours</strong>.</p>
<p style="margin:24px 0;">
  <a href="${escapeHtml(verifyUrl)}" style="display:inline-block;background:#22c55e;color:#0a0a0a;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;">Confirm my email</a>
</p>
<p style="line-height:1.6;margin:0 0 12px;font-size:13px;color:#a0a0a0;">This link expires in ${ttlHours} hours. If you didn't request this email, you can safely ignore it — no further action is needed.</p>
<p style="line-height:1.6;margin:24px 0 0;font-size:13px;color:#a0a0a0;">— The DrFurman.ai team</p>
</div>
</body></html>`;
}

export function renderVerifySuccessHtml(): string {
  return `<!doctype html>
<html><head><title>Email confirmed — DrFurman.ai</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#0a0a0a;color:#e8e8e8;margin:0;padding:48px 16px;text-align:center;">
<div style="max-width:520px;margin:0 auto;">
<div style="font-size:48px;line-height:1;margin-bottom:16px;">✓</div>
<h1 style="font-size:28px;margin:0 0 16px;color:#22c55e;">Email confirmed</h1>
<p style="line-height:1.6;margin:0 0 24px;font-size:16px;color:#c0c0c0;">
You're all set. You can send up to 5 more messages over the next 24 hours.
</p>
<a href="/" style="display:inline-block;background:#22c55e;color:#0a0a0a;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;">Back to chat</a>
</div>
</body></html>`;
}

export function renderVerifyFailureHtml(reason: string): string {
  return `<!doctype html>
<html><head><title>Verification link invalid — DrFurman.ai</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#0a0a0a;color:#e8e8e8;margin:0;padding:48px 16px;text-align:center;">
<div style="max-width:520px;margin:0 auto;">
<h1 style="font-size:28px;margin:0 0 16px;color:#f87171;">Link couldn't be verified</h1>
<p style="line-height:1.6;margin:0 0 8px;font-size:16px;color:#c0c0c0;">
This verification link is invalid or has expired.
</p>
<p style="line-height:1.6;margin:0 0 24px;font-size:13px;color:#808080;">Reason: ${escapeHtml(reason)}</p>
<a href="/" style="display:inline-block;background:#ffffff;color:#0a0a0a;font-weight:600;padding:14px 28px;border-radius:999px;text-decoration:none;">Back to chat</a>
</div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
