/* global browser */
"use strict";

// A link is sent only after the user explicitly chooses this menu item.
const menuId = "send-link-to-wheregoes";

browser.runtime.onInstalled.addListener(() => {
  browser.menus.create({
    id: menuId,
    title: "Trace link with WhereGoes",
    contexts: ["link"]
  });
});

browser.menus.onClicked.addListener((info) => {
  if (info.menuItemId !== menuId || !info.linkUrl) return;

  // Only HTTP(S) links are meaningful for this service. Never evaluate or
  // open a javascript:, file:, data:, or other privileged URL.
  let url;
  try {
    url = new URL(info.linkUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
  } catch {
    return;
  }

  const destination = "https://wheregoes.com/#flr-url=" + encodeURIComponent(info.linkUrl);
  browser.tabs.create({ url: destination });
});
