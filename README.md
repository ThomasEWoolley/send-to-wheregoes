# Send to WhereGoes

A Firefox extension which sends a link you deliberately select to [WhereGoes](https://wheregoes.com/) so the website can trace its redirects. Right-click a hyperlink and choose **Trace link with WhereGoes**, or paste a URL into the toolbar popup. The extension fills and attempts to submit WhereGoes' form. It does **not** intercept ordinary browsing or contact redirect targets itself. This is an independent extension, not affiliated with WhereGoes.

## Authorship and reproducibility

**Created with OpenAI ChatGPT, model GPT-6**, through an iterative conversation with the repository owner on **9 October 2026**. ChatGPT generated and revised the extension, tests and documentation. The code was not independently security audited and has not yet been verified end-to-end in a real Firefox installation against WhereGoes. The owner is responsible for reviewing and distributing it. An exact model checkpoint, random seed, internal reasoning and complete prompt transcript are not supplied, so identical AI regeneration is not claimed.

The source, tests and build script in this repository provide *software* reproducibility. The extension has no third-party JavaScript libraries, compilation, remote executable code or AI service at runtime.

## Structure

- `extension/`: Manifest V3 extension source (JavaScript, HTML, CSS and SVG).
- `tests/run-tests.cjs`: dependency-free simulated browser and DOM tests.
- `scripts/build_extension.py`: deterministic packaging of the seven extension files.
- `docs/`: proposed GitHub Pages privacy notice and automatic update JSON.
- `REPRODUCIBILITY.md`, `REVIEWER_NOTES.md`: validation, signing and release requirements.

## Tests and packaging

Requires **Node.js 18+** and **Python 3.9+**. From the repository root:

```sh
node tests/run-tests.cjs
python scripts/build_extension.py
```

The script generates `dist/send-to-wheregoes-1.2.1-unsigned.zip` with `manifest.json` at the ZIP root, as required for Mozilla submission. No packages are downloaded or installed. ZIP checksums may vary between zlib versions, so review source contents as well as the archive. See [REPRODUCIBILITY.md](REPRODUCIBILITY.md).

## Mozilla signing

The ZIP is **unsigned** and is not permanently installable in standard Firefox. Submit it through [Mozilla's Developer Hub](https://addons.mozilla.org/developers/) as **unlisted** (self-distributed), then install the Mozilla-signed `.xpi` from Firefox's Add-ons Manager. Mozilla policy compliance, signing and end-to-end Firefox operation have not yet been independently confirmed.

## Automatic update hosting

The add-on has a stable ID of `send-to-wheregoes@thomasewoolley.github.io`, with a declared future update manifest:

`https://thomaswoolley.co.uk/send-to-wheregoes/updates.json`

GitHub Pages must still be activated for this repository using **Settings → Pages → Deploy from a branch → main → /docs**. The owner's separate user website uses the custom domain `thomaswoolley.co.uk`, so verify the actual project Pages URL and its HTTPS response before submitting the extension. The current `docs/updates.json` contains no releases, correctly avoiding the publication of an unsigned update. Any future `update_link` must point to a Mozilla-signed XPI.

A previous provisional update manifest exists in the owner's personal website repository; do not remove it until the new hosting has been verified and no installed clients depend on the old address. This project does not change the personal website.

## Privacy

The extension requests only `menus`, `activeTab` and access to `https://wheregoes.com/*`. The chosen URL is sent to WhereGoes, a third-party website, on explicit user action; URLs may contain tokens or personal information. It declares the transmitted-data categories `browsingActivity` and `websiteContent`. No analytics, developer backend or continuous browsing monitoring is used. See [the privacy notice](docs/privacy.html).

## Status

Source release candidate **1.2.1**. Browser integration and Mozilla signing remain outstanding. Any GitHub Pages URL requires deployment and verification. Public source visibility does not itself confer an open-source licence; no licence has been chosen on the owner's behalf.
