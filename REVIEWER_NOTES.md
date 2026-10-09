# Mozilla reviewer information

**Send to WhereGoes 1.2.1**. Firefox Manifest V3. Proposed submission: **unlisted / self-distribution**.

**AI authorship:** OpenAI ChatGPT, model GPT-6, generated and revised the extension source, tests and documentation on 9 October 2026. Human repository owner: \`ThomasEWoolley\`. No independently audited security review is claimed.

**Function:** The user chooses **Trace link with WhereGoes** from a hyperlink context menu or pastes an HTTP(S) URL in the toolbar popup. The extension opens \`https://wheregoes.com/\` with the URL encoded in its fragment. Its sole content script fills the WhereGoes form, removes the fragment from the address bar and attempts submission. The extension never requests the tracking link independently, circumvents anti-bot systems or modifies other websites.

**Permission justification:**

- \`menus\`: create and handle the explicit hyperlink context-menu item.
- \`activeTab\`: prefill the toolbar popup with the current tab URL only when the popup is opened.
- Host \`https://wheregoes.com/*\`: allow the content script to fill the third-party form, without access to unrelated origins.

**Data transmission:** When the user expressly requests a trace, the selected URL is passed to the WhereGoes website. A URL can contain browsing information or website content, so \`browser_specific_settings.gecko.data_collection_permissions.required\` declares \`browsingActivity\` and \`websiteContent\`. There is no analytics, developer endpoint, third-party code library or background browsing monitor.

**Source and tests:** Unminified, dependency-free JavaScript, HTML, CSS and SVG in \`extension/\`. Reproduce the source ZIP using \`python scripts/build_extension.py\` and run the tests using \`node tests/run-tests.cjs\`; see \`REPRODUCIBILITY.md\`.

**Manual verification:** Install temporarily and right-click an ordinary hyperlink to test tracing. Repeat through the popup. The third-party form might change; automatic submission cannot be guaranteed without manual testing. There are no credentials or test accounts.

**Privacy notice:** https://thomaswoolley.co.uk/send-to-wheregoes/privacy.html

**Declared update manifest:** https://raw.githubusercontent.com/ThomasEWoolley/send-to-wheregoes/main/docs/updates.json

The public URLs depend on GitHub Pages activation and require a live HTTPS check. Mozilla determines policy compliance and signing eligibility.
