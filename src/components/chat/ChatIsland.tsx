import { useCallback, useEffect, useRef, useState } from "react";
import { brand } from "../../brand.config";
import { BrandAvatar } from "./BrandAvatar";
import { FREE_MESSAGE_QUOTA, FREE_MESSAGES_BEFORE_EMAIL, getDivinci } from "../../lib/divinci";
import { loadEscrow, saveEscrow } from "../../lib/escrow";
import { WelcomeMessage } from "./WelcomeMessage";
import { ConversationStarters } from "./ConversationStarters";
import { Transcript, type TranscriptMessage } from "./Transcript";
import { MessageInput } from "./MessageInput";
import { StickyChatBar } from "./StickyChatBar";
import { SignupCTA } from "./SignupCTA";
import { AnonLimitCTA } from "./AnonLimitCTA";

import { isDisposableEmail } from "../../lib/disposable-emails";
import { getLocaleMeta, DEFAULT_LOCALE } from "../../i18n/locales";
import { getUI } from "../../i18n";
import { CHAT_SYSTEM_STRINGS as SYS } from "../../i18n/chat-system-strings";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// A disposable email is NOT valid for the gate — keeps the email gate
// open and shows the inline error from MessageInput's disposable watcher.
const isValidEmail = (e: string | null) =>
  !!e && EMAIL_RE.test(e.trim()) && !isDisposableEmail(e.trim());

interface ChatIslandProps {
  /** Active page locale (BCP-47). Drives the chat's response language. */
  lang?: string;
}

export function ChatIsland({ lang = DEFAULT_LOCALE }: ChatIslandProps) {
  // Localized chat strings for the current page locale — so the chat's
  // greeting, starters, gate form, and errors switch with the page.
  const t = getUI(lang).chat;
  // Header strings for the active chat card reuse the static showcase's
  // `transcript` dict (e.g. the "Online" status pill).
  const tt = getUI(lang).transcript;
  const divinciRef = useRef(getDivinci());
  // The language we ask the assistant to respond in. English is the
  // default and needs no instruction (the model already answers in the
  // user's language); for any other page locale we pass the English
  // language name, which the server turns into a "respond in X"
  // system instruction so the chat matches the page.
  const chatLanguage =
    lang && lang !== DEFAULT_LOCALE ? getLocaleMeta(lang).englishName : null;

  // Escrow (email / transcriptId) is read from localStorage AFTER mount, not
  // during render. Reading it inline would make the first client render differ
  // from the server-rendered HTML and trip a hydration mismatch (React #418).
  const [email, setEmail] = useState("");
  // Chat opener (welcome + starters) renders from the localized `chat`
  // dict above (t.welcomeMessage / t.starters) so it switches with the
  // page locale. STOPGAP: once the Divinci Release-config endpoint
  // (/api/v1/whitelabel-releases/{id}) is reachable, the opener should
  // come from localized release content server-side — see the note in
  // src/lib/divinci.ts (FALLBACK_RELEASE) and src/i18n/ui/en.ts (chat).
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  // Server-managed welcome (translated) for this locale, fetched at mount.
  // Null until/unless it arrives, so we fall back to the localized dict
  // welcome (t.welcomeMessage) — resilient if the release has no welcome
  // configured or the upstream is unavailable.
  const [serverWelcome, setServerWelcome] = useState<string | null>(null);
  // The Release's uploaded avatar (whitelabel picture) — replaces the static
  // placeholder logo everywhere end-users see the assistant.
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [transcriptId, setTranscriptId] = useState<string | null>(null);
  // The signed anonymous transcript from the latest /api/chat-send — held so a
  // thumbs/feedback submission can prove authenticity to /api/chat-feedback.
  const [anonTranscript, setAnonTranscript] = useState<unknown[]>([]);
  const [signiture, setSigniture] = useState<string | null>(null);
  // Refs mirror the signed transcript + signature so the NEXT send reads the
  // current rolling chain synchronously. The send callback's deps don't
  // include these, so reading the state directly would capture a stale (often
  // empty) transcript and break the upstream signature verification.
  const anonTranscriptRef = useRef<unknown[]>([]);
  const signitureRef = useRef<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * The DIVINCI-side anonymous cap (release.maxAnonymousChatMessages), which
   * is a different ceiling from this page's own free-message quota and needs a
   * different exit: sign in at Divinci, not sign up with the customer.
   * Server-driven — this tab cannot count it, because the cap is enforced over
   * the signed transcript the server holds.
   */
  const [anonLimit, setAnonLimit] = useState(false);
  /**
   * Set when the WORKER says the anonymous grace window is spent, which can
   * happen before this tab's own count reaches the limit — the server keys the
   * grace on the visitor's IP, so a second tab, a reload, or a colleague behind
   * the same NAT can consume it. The server is authoritative; this makes the
   * client agree with it instead of re-sending into a refusal.
   */
  const [graceOverride, setGraceOverride] = useState(false);

  // Derived here — ABOVE the effects — rather than next to the other derived
  // render flags further down. An effect's dependency array is evaluated
  // during render, so a `const` declared later would be in its temporal dead
  // zone and throw on first paint.
  const graceSpent =
    graceOverride ||
    messages.filter((m) => m.role === "user").length >= FREE_MESSAGES_BEFORE_EMAIL;
  // An address is required only once the grace window is spent. MessageInput
  // hides the email row entirely while this is false and the field is empty,
  // so a first-time visitor sees a chat box, not a form standing in front of
  // one.
  const emailRequired = graceSpent && !isValidEmail(email);
  const [chatStarted, setChatStarted] = useState(false);
  // Terms-of-Service gate (medical disclaimer): set when chat-send returns
  // 403 TERMS_NOT_ACCEPTED. Holds the gate payload + the blocked message so
  // "I Agree" can accept and automatically re-send it.
  const [tosGate, setTosGate] = useState<{
    tosId: string;
    version: number;
    title: string;
    content: string;
    retry: { content: string; isStarter?: boolean };
  } | null>(null);
  const [tosBusy, setTosBusy] = useState(false);
  const [tosError, setTosError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [focusSignal, setFocusSignal] = useState(0);
  // Message queued by an external prefill (the landing example composer) to
  // auto-send once the prefilled email has propagated into state.
  const [pendingExampleSend, setPendingExampleSend] = useState<string | null>(null);

  const handleSendRef = useRef<(text: string) => void>(() => {});

  // Stable per-visitor session id (held in a ref so it's available
  // synchronously in send/feedback without re-render churn). Restored from
  // escrow, or minted lazily on the first send and persisted so the whole
  // conversation maps to ONE server-side customer chat.
  const sessionIdRef = useRef<string | null>(null);
  const ensureSessionId = useCallback((): string => {
    if (!sessionIdRef.current) {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      sessionIdRef.current = id;
      saveEscrow({ sessionId: id });
    }
    return sessionIdRef.current;
  }, []);

  // Hydrate email + transcriptId + sessionId from escrow once, on the client
  // only (see the note on the email state above).
  useEffect(() => {
    const esc = loadEscrow();
    if (esc.email) setEmail(esc.email);
    if (esc.transcriptId) setTranscriptId(esc.transcriptId);
    if (esc.sessionId) sessionIdRef.current = esc.sessionId;
  }, []);

  // Fetch the server-side welcome for this locale (worker proxies it to the
  // platform's release welcome, translated). Safe text()+JSON.parse per
  // the repo convention; any failure leaves serverWelcome null → dict
  // fallback. chatLanguage is the English name for non-English locales.
  useEffect(() => {
    let cancelled = false;
    const qs = chatLanguage ? `?language=${encodeURIComponent(chatLanguage)}` : "";
    fetch(`/api/welcome${qs}`)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((txt) => {
        if (cancelled) return;
        const data = JSON.parse(txt) as { messages?: Array<{ message?: string }> };
        const first = data.messages?.[0]?.message?.trim();
        if (first) setServerWelcome(first);
      })
      .catch(() => {
        /* keep the localized dict welcome */
      });
    return () => {
      cancelled = true;
    };
  }, [chatLanguage]);

  // Release avatar — cached briefly at the edge; null keeps the fallback logo.
  useEffect(() => {
    fetch("/api/release-meta")
      .then((r) => (r.ok ? (r.json() as Promise<{ avatarUrl?: string | null }>) : null))
      .then((d) => {
        if (d && typeof d.avatarUrl === "string") setAvatarUrl(d.avatarUrl);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!chatStarted) return;
    const bg = document.getElementById("hero-bg");
    if (bg) bg.classList.add("opacity-10");
    // Expand the orb into the full-width chat card (the glass circle fades
    // out + the wrapper drops its circular padding — see HeroSection's
    // `.chat-panel-wrapper.chat-active` rules).
    const wrapper = document.querySelector(".chat-panel-wrapper");
    if (wrapper) wrapper.classList.add("chat-active");
  }, [chatStarted]);

  const handleSend = useCallback(
    async (rawContent: string, opts?: { starter?: boolean }) => {
      const content = rawContent.trim();
      const isStarter = opts?.starter === true;
      if (!content) return;
      // Grace window — the first FREE_MESSAGES_BEFORE_EMAIL sends need no
      // address. Asking before the visitor has seen a single answer was the
      // most common complaint about the demos: it reads as a lead-capture
      // form standing in front of the product rather than a product.
      const userMessagesSoFar = messages.filter(
        (m) => m.role === "user",
      ).length;
      const withinGrace = !graceOverride && userMessagesSoFar < FREE_MESSAGES_BEFORE_EMAIL;
      if (!withinGrace && !isValidEmail(email)) {
        setError(t.errorEmailRequired);
        return;
      }
      // Quota gate — after the grace window a visitor gets FREE_MESSAGE_QUOTA
      // further answer(s), after which the input is replaced by the sign-up /
      // log-in CTA.
      if (userMessagesSoFar >= FREE_MESSAGES_BEFORE_EMAIL + FREE_MESSAGE_QUOTA) return;
      if (pending) return;
      setError(null);

      const userMsg: TranscriptMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        isStarter,
      };
      const assistantPlaceholder: TranscriptMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        pending: true,
      };
      setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
      setPending(true);
      setChatStarted(true);
      saveEscrow({ email: email.trim() });
      // v1: real email-capture endpoint is a Phase 8 follow-up. PII rule
      // from CLAUDE.md — log metadata only, never the raw email.
      const trimmedEmail = email.trim();
      const atIdx = trimmedEmail.lastIndexOf("@");
      console.info("[divinci-landing] email captured (v1 stub)", {
        hasEmail: true,
        emailDomain: atIdx > 0 ? trimmedEmail.slice(atIdx + 1) : "unknown",
      });

      try {
        // /api/chat-send is the quota-gated proxy to Divinci's anonymous-chat
        // endpoint. We send the rolling signed transcript + its signature so
        // the chat is MULTI-TURN (the assistant sees prior context) and the
        // whole conversation persists server-side. Returns the appended
        // { transcript, signiture }, or 402 if the free message was used.
        const resp = await fetch("/api/chat-send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            newPrompt: content,
            // Rolling signed conversation (empty/"" on the first turn).
            transcript: anonTranscriptRef.current,
            prevSigniture: signitureRef.current ?? "",
            // Mark starter sends so the worker draws on the separate
            // starter budget instead of the lifetime manual message.
            ...(isStarter ? { starter: true } : {}),
            // When the page is in a non-English locale, ask the
            // assistant to answer in that language. Omitted for English.
            ...(chatLanguage ? { language: chatLanguage } : {}),
            // Stable session id → the server persists this conversation as
            // one customer chat (analytics + feedback-conversation link).
            sessionId: ensureSessionId(),
          }),
        });

        if (resp.status === 402) {
          // `email_required` is the end of the anonymous grace window, NOT the
          // end of the free tier: the visitor has more messages available as
          // soon as they identify themselves. Reveal the field and roll the
          // bubbles back so their question is not lost — flipping to the
          // SignupCTA here would tell them they were out of messages when they
          // were one text field away from continuing.
          const q = (await resp.json().catch(() => null)) as { error?: string; message?: string } | null;
          if (q?.error === "email_required") {
            setGraceOverride(true);
            setMessages((prev) =>
              prev.filter(
                (m) => m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
              ),
            );
            setDraft(content);
            setError(q.message ?? t.errorEmailRequired);
            return;
          }
          // A starter-budget 402 must NOT flip the page to the SignupCTA —
          // the visitor still has their free manual message. Just clear
          // the bubbles so they can ask their own question.
          if (isStarter) {
            setMessages((prev) =>
              prev.filter(
                (m) =>
                  m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
              ),
            );
            setError(null);
            return;
          }
          // Manual quota exhausted — clear placeholder, mark transcript so
          // the quotaExhausted derivation flips to SignupCTA.
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantPlaceholder.id),
          );
          setError(null);
          setTranscriptId("__quota__");
          saveEscrow({ transcriptId: "__quota__" });
          return;
        }

        if (resp.status === 403) {
          // Terms-of-Service gate: the release requires accepting a published
          // medical disclaimer / ToS version before chatting. Pop the modal
          // and stash the message so an "I Agree" re-sends it automatically.
          // Roll the bubbles back (nothing was sent) without an error toast.
          const gate = (await resp.json().catch(() => null)) as {
            error?: {
              code?: string;
              details?: { tosId?: string; version?: number; title?: string; content?: string };
            };
          } | null;
          const d = gate?.error?.details;
          if (gate?.error?.code === "TERMS_NOT_ACCEPTED" && d?.tosId && typeof d.version === "number") {
            setMessages((prev) =>
              prev.filter(
                (m) => m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
              ),
            );
            setError(null);
            setTosGate({
              tosId: d.tosId,
              version: d.version,
              title: d.title || "Terms of Service",
              content: d.content || "",
              retry: { content, isStarter },
            });
            return;
          }
          throw new Error(`chat-send failed: ${resp.status}`);
        }

        // The Divinci anonymous-message cap. Until 2026-08-17 this arrived as
        // the same flat 502 as an outage and rendered as "Network error",
        // which is both wrong and a dead end — the visitor has somewhere to go.
        if (resp.status === 409) {
          const b = (await resp.json().catch(() => null)) as { error?: string } | null;
          if (b?.error === "anon_limit_reached") {
            setMessages((prev) =>
              prev.filter(
                (m) => m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
              ),
            );
            setDraft(content);
            setError(null);
            setAnonLimit(true);
            return;
          }
        }

        // Rate limited upstream — transient, and NOT the visitor's doing:
        // within one release every Worker-fronted visitor shares a bucket.
        if (resp.status === 429) {
          setMessages((prev) =>
            prev.filter(
              (m) => m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
            ),
          );
          setDraft(content);
          setError(SYS.errorBusy);
          return;
        }

        if (!resp.ok) {
          // A 5xx is ours. Say so — "Network error" sends the visitor to check
          // their wifi and reload, which reproduces it. Keep their text in the
          // composer so a retry is one click, not a retype.
          if (resp.status >= 500) {
            setMessages((prev) =>
              prev.filter(
                (m) => m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
              ),
            );
            setDraft(content);
            setError(SYS.errorServer);
            return;
          }
          throw new Error(`chat-send failed: ${resp.status}`);
        }

        const data = (await resp.json()) as {
          transcript?: Array<{
            prompt?: string;
            response?: string;
            context?: Array<{
              content?: string;
              metadata?: {
                originalName?: string;
                sourceUrl?: string;
                tileImages?: Array<{ url?: string }>;
              };
            }>;
            safetyAdvisory?: {
              severity: "review" | "severe";
              text: string;
              categories?: string[];
            };
          }>;
          signiture?: string;
        };
        // Hold the signed transcript so thumbs/feedback can authenticate to
        // /api/chat-feedback (the worker forwards it to anonymous-feedback).
        if (Array.isArray(data.transcript)) {
          setAnonTranscript(data.transcript);
          anonTranscriptRef.current = data.transcript;
        }
        if (typeof data.signiture === "string") {
          setSigniture(data.signiture);
          signitureRef.current = data.signiture;
        }
        const lastMsg = data.transcript?.[data.transcript.length - 1];
        const reply = lastMsg?.response ?? "(no response)";
        // One source per retrieved context item, IN ORDER and NOT deduped —
        // the model's inline `[n]` citations are 1-based indices into this same
        // context list, so `sources[n-1]` must line up with the n-th item for
        // the citation tooltip + click-to-highlight to point at the right chip.
        // (A missing originalName keeps its slot via a fallback so indices never
        // shift.) The chips collapse to one row in the Transcript, so showing
        // every item — including same-file chunks — stays tidy.
        const sources = (lastMsg?.context ?? []).map(
          (c) => c.metadata?.originalName || `${brand.identity.siteName}'s knowledge base`,
        );
        // Detail behind each chip, INDEX-ALIGNED with `sources` above so a
        // citation [n] and its bubble describe the same retrieval. Built from
        // the same response — no extra request, nothing else to keep in sync.
        const sourceDetails = (lastMsg?.context ?? []).map((c, i) => ({
          name: sources[i]!,
          excerpt: typeof c.content === "string" ? c.content.trim().slice(0, 320) : undefined,
          url: typeof c.metadata?.sourceUrl === "string" ? c.metadata.sourceUrl : undefined,
          // A rendered page beats an excerpt: for a scanned insert it IS the
          // evidence. Only ever the first tile — the bubble is a glance.
          image: c.metadata?.tileImages?.[0]?.url,
        }));
        // Medical-safety advisory (server-side medicalSafety check). Carried
        // verbatim from the signed payload → rendered as an amber banner
        // under the reply bubble.
        const safetyAdvisory =
          lastMsg?.safetyAdvisory && typeof lastMsg.safetyAdvisory.text === "string"
            ? lastMsg.safetyAdvisory
            : undefined;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantPlaceholder.id
              ? { ...m, content: reply, sources, sourceDetails, safetyAdvisory, pending: false }
              : m,
          ),
        );
      } catch (err) {
        console.error("[ChatIsland] send failed", err);
        // The server never recorded a successful chat (the worker quota
        // was never burned). Remove BOTH the user message and the
        // assistant placeholder so the SignupCTA doesn't fire prematurely
        // and the user can retry. The error toast is enough feedback.
        setMessages((prev) =>
          prev.filter(
            (m) => m.id !== assistantPlaceholder.id && m.id !== userMsg.id,
          ),
        );
        setError(t.errorNetwork);
      } finally {
        setPending(false);
      }
    },
    [email, pending, transcriptId, messages],
  );

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  // Thumbs/feedback for an assistant reply → /api/chat-feedback (worker proxy
  // to Divinci's anonymous-feedback, authenticated by the held signed
  // transcript). Throws on failure so the Transcript UI can surface a retry.
  const handleFeedback = useCallback(
    async (
      messageIndex: number,
      input: { sentiment?: -1 | 1; feedback?: string },
    ) => {
      if (!signiture) return;
      const resp = await fetch("/api/chat-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: anonTranscript,
          signiture,
          messageIndex,
          sentiment: input.sentiment,
          feedback: input.feedback,
          // The gate email, so the admin can see who left the feedback.
          ...(email.trim() ? { email: email.trim() } : {}),
          // Same session id as chat-send → links the feedback to the
          // persisted conversation.
          sessionId: ensureSessionId(),
        }),
      });
      if (!resp.ok) throw new Error(`feedback failed: ${resp.status}`);
    },
    [anonTranscript, signiture, email],
  );

  // ?prompt= (or ?q=) deep link: arrive with a question pre-filled in the
  // composer and skip the conversation starters — the visitor already has
  // intent, so the input takes the hero instead.
  const [urlPrompt, setUrlPrompt] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt") || params.get("q");
    if (!prompt) return;
    setUrlPrompt(true);
    setDraft(prompt);
    setFocusSignal((n) => n + 1);
  }, []);

  // Example-card clicks dispatch divinci:populateInput — pre-fill the
  // draft and focus the textarea instead of auto-sending. The user then
  // hits Enter to send (which gives them a chance to edit first).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ text?: string }>).detail;
      if (!detail?.text) return;
      setDraft(detail.text);
      setFocusSignal((n) => n + 1);
    };
    window.addEventListener("divinci:populateInput", handler);
    return () =>
      window.removeEventListener("divinci:populateInput", handler);
  }, []);

  // When embedded (e.g. the landing's example showcase), the host page can
  // pre-fill this composer via postMessage so a message typed in the static
  // example carries into the live chat — then the visitor just hits send.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { type?: string; text?: string; email?: string; send?: boolean } | null;
      if (!d || d.type !== "divinci-prefill") return;
      if (typeof d.email === "string" && isValidEmail(d.email)) {
        setEmail(d.email.trim());
        saveEscrow({ email: d.email.trim() });
      }
      if (typeof d.text === "string") {
        setDraft(d.text);
        setFocusSignal((n) => n + 1);
        if (d.send) setPendingExampleSend(d.text);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Once the prefilled email is valid in state, fire the queued example
  // message via the always-current handleSend ref (avoids stale-closure email).
  useEffect(() => {
    // Inside the grace window there is nothing to wait for — fire straight
    // away rather than stalling on an address we are not asking for.
    if (pendingExampleSend && !emailRequired) {
      const text = pendingExampleSend;
      setPendingExampleSend(null);
      handleSendRef.current(text);
    }
  }, [pendingExampleSend, email, emailRequired]);

  // Accept the gated ToS version for this visitor's sessionId, then re-send
  // the message that was blocked. A 409 means a newer version was published
  // mid-flight — surface it and let the next send refetch the fresh gate.
  const acceptTos = useCallback(async () => {
    if (!tosGate || tosBusy) return;
    setTosBusy(true);
    setTosError(null);
    try {
      const resp = await fetch("/api/terms-accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tosId: tosGate.tosId,
          version: tosGate.version,
          sessionId: ensureSessionId(),
        }),
      });
      if (!resp.ok) {
        setTosError(
          resp.status === 409
            ? "These terms were just updated — please close and try again to see the new version."
            : "Could not record your acceptance. Please try again.",
        );
        return;
      }
      const retry = tosGate.retry;
      setTosGate(null);
      handleSend(retry.content, { starter: retry.isStarter });
    } catch {
      setTosError("Could not record your acceptance. Please try again.");
    } finally {
      setTosBusy(false);
    }
  }, [tosGate, tosBusy, ensureSessionId, handleSend]);

  const showStarters = messages.length === 0 && !urlPrompt;
  // EVERY user message counts toward the free-message quota — clicking a
  // conversation-starter OR typing a question both spend the one free answer,
  // after which the input swaps to the sign-up / log-in CTA.
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const quotaExhausted =
    userMessageCount >= FREE_MESSAGES_BEFORE_EMAIL + FREE_MESSAGE_QUOTA && !pending;
  // Medical-safety advisory: pinned at the bottom of the chat card (always
  // visible, not buried in the scrollback). Shows the most recent advisory
  // the server attached to any completed reply in this conversation.
  const latestAdvisory = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && !m.pending && m.content && m.safetyAdvisory)
    ?.safetyAdvisory;

  return (
    <>
    <div className="flex flex-col gap-5">
      {showStarters && (
        <>
          <WelcomeMessage text={serverWelcome ?? t.welcomeMessage} avatarUrl={avatarUrl} />
          <ConversationStarters
            label={t.tryAsking}
            starters={t.starters}
            disabled={pending}
            onSelect={(text) => {
              // Send the starter immediately when nothing is being asked of
              // the visitor — either they are inside the grace window, or they
              // have already given a valid address. One tap, no extra "Ask"
              // click. Only when an email IS required do we fall back to
              // pre-filling the input so they can fill the field first.
              if (!emailRequired) {
                handleSend(text, { starter: true });
              } else {
                setDraft(text);
                setFocusSignal((n) => n + 1);
              }
            }}
          />
        </>
      )}
      {messages.length > 0 ? (
        // Active chat — "grows out" of the orb into a wide card that mirrors
        // the static TranscriptShowcase (header · messages · single composer).
        <div className="df-active-card overflow-hidden rounded-3xl border border-df-green-dark/15 bg-gradient-to-b from-df-green-leaf/10 to-df-surface shadow-lg ring-1 ring-df-text/5">
          <div className="flex items-center gap-2 border-b border-df-green-dark/10 bg-df-surface/70 px-5 py-3 backdrop-blur-sm">
            <BrandAvatar avatarUrl={avatarUrl} size="h-7 w-7" className="bg-df-green-leaf/20 ring-1 ring-df-green-dark/15" />
            <span className="font-semibold text-df-brand-ink">{brand.identity.productName}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-df-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-df-green-leaf opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-df-green-mid" />
              </span>
              {tt.online}
            </span>
          </div>
          <div className="px-4 py-5 md:px-6">
            <Transcript messages={messages} onFeedback={handleFeedback} avatarUrl={avatarUrl} />
          </div>
          {latestAdvisory && (
            <div className="px-4 pb-3 md:px-6">
              {/* Same card style as the original inline banner (rounded, amber
                  left border) — just pinned here below the transcript instead
                  of buried in the scrollback. */}
              <div
                role="alert"
                data-testid="safety-advisory"
                className="ml-9 flex max-w-[88%] items-start gap-2 rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-df-muted-strong md:text-sm"
              >
                <span aria-hidden="true" className="mt-0.5">⚕️</span>
                <span>{latestAdvisory.text}</span>
              </div>
            </div>
          )}
          <div className="border-t border-df-green-dark/10 bg-df-surface/70 p-3 backdrop-blur-sm">
            {anonLimit ? (
              <AnonLimitCTA lang={lang} />
            ) : quotaExhausted ? (
              <SignupCTA lang={lang} />
            ) : (
              <MessageInput
                compact
                lang={lang}
                email={email}
                onEmailChange={setEmail}
                emailRequired={emailRequired}
                draft={draft}
                onDraftChange={setDraft}
                focusSignal={focusSignal}
                onSend={handleSend}
                pending={pending}
              />
            )}
          </div>
        </div>
      ) : anonLimit ? (
        <AnonLimitCTA lang={lang} />
      ) : quotaExhausted ? (
        <SignupCTA lang={lang} />
      ) : (
        <MessageInput
          lang={lang}
          email={email}
          onEmailChange={setEmail}
          emailRequired={emailRequired}
          draft={draft}
          onDraftChange={setDraft}
          focusSignal={focusSignal}
          onSend={handleSend}
          pending={pending}
        />
      )}
      {/* Disclaimer with intentional line breaks so it wraps gracefully on
          narrow screens instead of orphaning a single word. text-balance
          evens out any line that still wraps. */}
      <p className="text-balance text-center text-xs leading-relaxed text-df-muted">
        {t.disclaimer[0]} {t.disclaimer[1]}
        <br />
        {t.disclaimer[2]}
      </p>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
    {/* Sticky composer — shares this island's state (email/draft/quota) and
        send handler, so a question typed at the bottom of the page flows
        through the same gated /api/chat-send path as the hero panel. It
        reveals itself once the hero scrolls out of view. */}
    {/* The sticky bar has no anon-limit state of its own: hiding its composer
        is the right behaviour for EITHER ceiling, so both feed one prop. */}
    <StickyChatBar
      lang={lang}
      emailRequired={emailRequired}
      draft={draft}
      onDraftChange={setDraft}
      onSend={handleSend}
      pending={pending}
      quotaExhausted={quotaExhausted || anonLimit}
    />
    {tosGate && (
      <TermsModal
        title={tosGate.title}
        content={tosGate.content}
        busy={tosBusy}
        error={tosError}
        onAgree={acceptTos}
        onClose={() => {
          setTosGate(null);
          setTosError(null);
        }}
      />
    )}
    </>
  );
}

/**
 * Terms-of-Service / medical-disclaimer acceptance modal. Shown when the
 * release gates chat behind a published ToS version. Renders the document's
 * markdown with a deliberately tiny formatter (headings + bold + paragraphs —
 * same no-dependency approach as the transcript renderer).
 */
function TermsModal({
  title,
  content,
  busy,
  error,
  onAgree,
  onClose,
}: {
  title: string;
  content: string;
  busy: boolean;
  error: string | null;
  onAgree: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-df-green-dark/15 bg-df-surface shadow-2xl">
        <div className="border-b border-df-green-dark/10 bg-df-green-leaf/10 px-5 py-3">
          <h2 className="text-base font-semibold text-df-brand-ink">{title}</h2>
        </div>
        <div className="df-chat-scroll flex-1 space-y-2 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-df-text">
          {renderTosContent(content)}
        </div>
        <div className="border-t border-df-green-dark/10 bg-df-surface/90 px-5 py-3">
          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-3 py-1.5 text-sm text-df-muted hover:text-df-muted-strong"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={onAgree}
              disabled={busy}
              className="rounded-lg bg-df-green-dark px-4 py-1.5 text-sm font-medium text-df-on-chrome transition hover:bg-df-green-mid disabled:opacity-60"
            >
              {busy ? "Saving…" : "I Agree"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Markdown-lite for the ToS body: #/##/### headings, **bold**, paragraphs. */
function renderTosContent(text: string) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks.map((block, i) => {
    const heading = block.match(/^(#{1,3})\s+(.*)$/);
    const renderBold = (s: string) =>
      s.split(/\*\*([^*]+)\*\*/g).map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      );
    if (heading) {
      return (
        <p key={i} className="pt-1 font-semibold text-df-brand-ink">
          {renderBold(heading[2])}
        </p>
      );
    }
    return <p key={i}>{renderBold(block)}</p>;
  });
}
