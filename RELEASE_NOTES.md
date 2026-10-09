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
- GitHub Pages: deployed, but the inherited custom domain failed certificate validation. Manifest update URL now uses GitHub's HTTPS raw-file service.

Archive bytes can vary with the Python/zlib toolchain despite identical source contents. The source and build steps are authoritative. No third-party package or licence has been added.

The update URL was corrected before Mozilla submission following a real HTTPS certificate failure on the custom domain. This does not alter the extension's redirect handling.

## Validated hosting (9 October 2026)

A GitHub-hosted Actions run verified that the new HTTPS update manifest and privacy notice return HTTP 200 with valid TLS. Build and 17 tests pass in CI: [run 37916854329](https://github.com/ThomasEWoolley/send-to-wheregoes/actions/runs/37916854329).
