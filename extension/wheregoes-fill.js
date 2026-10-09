"use strict";

// Runs ONLY on https://wheregoes.com/*. An ordinary visit to WhereGoes is
// unchanged; the extension acts only when its own #flr-url= marker is present.
(() => {
  const marker = "#flr-url=";
  if (!location.hash.startsWith(marker)) return;

  let supplied;
  try {
    supplied = decodeURIComponent(location.hash.slice(marker.length));
    const url = new URL(supplied);
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
  } catch {
    return;
  }

  // Avoid leaving the submitted link in the address bar or in a copied
  // WhereGoes URL. URL fragments are not sent in the initial HTTP request.
  try {
    history.replaceState(history.state, "", location.pathname + location.search);
  } catch { /* Filling the form still works if this fails. */ }

  let finished = false;
  let observer;
  let timeout;

  function eligible(el) {
    return !el.disabled && !el.readOnly && el.type !== "hidden" &&
      el.getAttribute("aria-hidden") !== "true";
  }

  function findUrlInput() {
    // WhereGoes currently advertises an http://... input. The named-input
    // choices also cover the site's historical 'url' POST form field.
    const selectors = [
      'input[name="url"]',
      'textarea[name="url"]',
      'input#url',
      'input[type="url"]',
      'input[placeholder^="http"]',
      'textarea[placeholder^="http"]'
    ];
    for (const selector of selectors) {
      const match = [...document.querySelectorAll(selector)].find(eligible);
      if (match) return match;
    }
    return null;
  }

  function finish() {
    finished = true;
    if (observer) observer.disconnect();
    if (timeout) clearTimeout(timeout);
  }

  function insertAndTrace() {
    if (finished) return;
    const input = findUrlInput();
    if (!input) return;
    finish();

    // This is plain text assignment, never markup or page-script execution.
    input.value = supplied;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    // We submit the original WhereGoes form rather than making an API call
    // or guessing hidden form tokens. This keeps site-side validation intact.
    const form = input.closest("form");
    if (!form) return; // The original input stays filled for manual tracing.

    // Let the website's input/change handlers run before initiating its form.
    setTimeout(() => {
      if (!input.isConnected || input.value !== supplied) return;
      const buttons = [...form.querySelectorAll('button, input[type="submit"], input[type="image"]')];
      const submit = buttons.find((button) => {
        if (button.disabled) return false;
        const type = (button.getAttribute("type") || "submit").toLowerCase();
        return type === "submit" || type === "image";
      });
      if (submit) {
        submit.click();
      } else if (typeof form.requestSubmit === "function") {
        form.requestSubmit();
      }
      // A custom page button may need a manual click. We deliberately avoid
      // clicking unrelated buttons or circumventing anti-bot mechanisms.
    }, 250);
  }

  // Observe any site-side asynchronous form rendering, with a strict bound.
  insertAndTrace();
  if (!finished) {
    observer = new MutationObserver(insertAndTrace);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    timeout = setTimeout(finish, 10000);
  }
})();
