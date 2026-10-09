# Source release candidate 1.2.1 (9 October 2026)

## Provenance

- Generated using **OpenAI ChatGPT, GPT-6**, following iterative user instructions.
- Human project owner: `ThomasEWoolley`.
- Full source and local tests are checked in. No prompt-only reproducibility is claimed.

## Reproducible build record

- Python at original check: `3.13.5`.
- Node.js at original check: `v22.16.0`.
- Automated tests: **17 passed**, using simulated browser/DOM.
- JavaScript syntax checks: passed for the original generated source.
- Build script: `python scripts/build_extension.py`.
- Output: `dist/send-to-wheregoes-1.2.1-unsigned.zip`.
- Current unsigned ZIP SHA-256 (Python 3.13.5, Node.js 22.16.0): `0704e9ae8cf59880335793159676a31d65f1439b1ed5c85044e0dfec601a90a8`. Rebuild using `python scripts/build_extension.py` and compare locally.
- ZIP integrity check: passed.
- Mozilla review and signature: **outstanding**.
- Real Firefox and live WhereGoes tests: **outstanding**.
- GitHub Pages: deployed; a certificate mismatch was initially detected on the inherited custom domain and then resolved by the owner. The Firefox manifest continues to use GitHub's independently validated HTTPS raw-file service.

Archive bytes can vary with the Python/zlib toolchain despite identical source contents. The source and build steps are authoritative. No third-party package or licence has been added.

The update URL was corrected before Mozilla submission following a real HTTPS certificate failure on the custom domain. This does not alter the extension's redirect handling.

## Validated hosting (9 October 2026)

A GitHub-hosted Actions run verified that the new HTTPS update manifest and privacy notice return HTTP 200 with valid TLS. Build and 17 tests pass in CI: [run 37916854329](https://github.com/ThomasEWoolley/send-to-wheregoes/actions/runs/37916854329).

## DNS and TLS recheck (9 October 2026)

The [independent domain audit](https://github.com/ThomasEWoolley/send-to-wheregoes/actions/runs/37924109107) passed: DNS resolves to GitHub Pages; the certificate matches `thomaswoolley.co.uk` and `www.thomaswoolley.co.uk`; the personal site, project page, custom-domain update/privacy pages and the active GitHub-hosted update manifest all return HTTP 200. No manifest changes were necessary after this correction.

## Firefox minimum version compatibility correction (9 October 2026)

Mozilla's validator warned that the declared data consent permissions require Firefox for Android 142, despite the previous shared minimum version being 140. Changed `gecko.strict_min_version` to `142.0`. Desktop builds 140 and 141 are no longer eligible; Firefox 142+ is supported. The extension remains desktop-only since it does not opt in using `gecko_android`. No runtime code, add-on ID or update URL was changed. The source release candidate stays at 1.2.1 until Mozilla accepts its first submission.
