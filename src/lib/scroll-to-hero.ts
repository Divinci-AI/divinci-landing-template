/** Delay before focusing the email field so smooth scroll can settle. */
const FOCUS_DELAY_MS = 450;

/** Scroll the hero chat into the center of the viewport. */
export function scrollToHeroChat(options?: { focusEmail?: boolean }) {
  document
    .getElementById("hero")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });

  if (!options?.focusEmail) return;

  window.setTimeout(() => {
    const field = document.getElementById("df-email-input");
    if (field instanceof HTMLElement) {
      field.focus({ preventScroll: true });
    }
  }, FOCUS_DELAY_MS);
}

/** Intercept in-page `#hero` hash links so they center the chat panel. */
export function initHeroHashLinks() {
  document.addEventListener("click", (e) => {
    const anchor = (e.target as Element).closest?.('a[href="#hero"]');
    if (!anchor) return;
    e.preventDefault();
    scrollToHeroChat({
      focusEmail: anchor.hasAttribute("data-focus-chat"),
    });
    history.pushState(null, "", "#hero");
  });

  function scrollIfHeroHash() {
    if (location.hash !== "#hero") return;
    scrollToHeroChat();
  }

  scrollIfHeroHash();
  window.addEventListener("hashchange", scrollIfHeroHash);
}
