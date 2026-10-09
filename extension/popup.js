/* global browser */
"use strict";

const form = document.getElementById("send-form");
const input = document.getElementById("url-input");
const error = document.getElementById("error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.hidden = true;
  const requested = input.value.trim();
  try {
    const url = new URL(requested);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Only HTTP and HTTPS links are supported.");
    }
    await browser.tabs.create({
      url: "https://wheregoes.com/#flr-url=" + encodeURIComponent(requested)
    });
    window.close();
  } catch (cause) {
    error.textContent = cause instanceof TypeError
      ? "Please enter a complete link beginning with https:// or http://."
      : (cause.message || "Couldn't open WhereGoes.");
    error.hidden = false;
  }
});

// The current page is prefilled only when the user opens the toolbar popup.
(async () => {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (/^https?:\/\//i.test(tab?.url || "")) input.value = tab.url;
  } catch { /* Paste still works if the active tab cannot be read. */ }
})();
