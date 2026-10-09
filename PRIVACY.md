# Send to WhereGoes: privacy notice

**Developer and authorship:** This independent Firefox extension was created with OpenAI ChatGPT (model GPT-6) for the GitHub account ThomasEWoolley. It is not affiliated with or endorsed by WhereGoes.

## What data is transmitted?

Only when you deliberately choose **Trace link with WhereGoes** from a hyperlink's context menu or press **Trace with WhereGoes** in the popup, the selected complete URL is sent to the third-party [WhereGoes](https://wheregoes.com/) website. This URL may contain tracking identifiers, private data, or one-time authentication tokens. Do not submit sensitive URLs.

The popup may prefill the current page URL when you open it, but it does not send that URL until you request tracing. When you use the right-click action, the extension opens the WhereGoes site and fills its form.

## What the extension does not do

The extension does **not** collect or store browsing history, read the contents of unrelated websites, continuously monitor browsing, send data to a developer-operated server, display advertising or track analytics. It does not execute remote extension code or change Firefox settings.

WhereGoes is a separate online service. Its data collection and privacy practices apply when you submit a URL to it. Opening WhereGoes itself may involve normal website network requests independent of this extension.

## Browser permissions

- `menus`: add the explicit right-click option for hyperlinks.
- `activeTab`: read the current page URL only when you open the toolbar popup.
- `https://wheregoes.com/*`: fill and submit the WhereGoes form after your explicit request.

Because user-provided URLs can reveal browsing information and webpage content, the Firefox manifest declares the required transmitted-data categories `browsingActivity` and `websiteContent` under Mozilla's built-in consent system. The add-on requires Firefox 140 or later.

## Source and maintenance

[View the public source and reproducibility notes](https://github.com/ThomasEWoolley/send-to-wheregoes). This privacy notice describes the extension source release candidate **1.2.1**, dated 9 October 2026.
