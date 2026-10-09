# Hosting and Mozilla signing

The repository is <https://github.com/ThomasEWoolley/send-to-wheregoes>. GitHub Pages was enabled and deployed on 9 October 2026. **The custom domain's TLS certificate currently does not validate** and must not be used as the Firefox update endpoint. To avoid affecting the personal website, the signed add-on will use a GitHub-hosted update manifest:

https://raw.githubusercontent.com/ThomasEWoolley/send-to-wheregoes/main/docs/updates.json

Privacy notice: https://github.com/ThomasEWoolley/send-to-wheregoes/blob/main/PRIVACY.md

## Before Mozilla submission

1. Check the [Actions audit](https://github.com/ThomasEWoolley/send-to-wheregoes/actions) succeeds. It tests the extension, builds the ZIP and verifies both remote HTTPS URLs from a GitHub runner.
2. Run `node tests/run-tests.cjs` and `python scripts/build_extension.py` from the repository root, using Node.js 18+ and Python 3.9+.
3. Submit `dist/send-to-wheregoes-1.2.1-unsigned.zip` to <https://addons.mozilla.org/developers/> as an **unlisted** extension. Download and install the Mozilla-signed `.xpi`.
4. Test the extension in a real Firefox installation against the current WhereGoes form.

## Signed updates

When Mozilla signs a later version, upload that signed XPI to `docs/` in this repository and add a corresponding version and absolute HTTPS `update_link` to `docs/updates.json`. Use the independent `raw.githubusercontent.com` host for the XPI file. Never publish unsigned ZIP/XPI files as Firefox updates. Keep the add-on ID and `update_url` fixed for existing installations.

## Old website folder

The old provisional hosting folder remains in the personal website repository. Do not delete it without checking whether any installed client still depends on the old update manifest.
