# Reproducibility and verification

## Provenance

- AI system: OpenAI ChatGPT.
- Model: **GPT-6**, as identified in the ChatGPT conversation.
- Project preparation: **9 October 2026**.
- Human repository owner: GitHub account \`ThomasEWoolley\`.
- Development: iterative user instructions, AI-generated code and documentation, manually executed automated tests.
- No exact model checkpoint, random seed, full prompt transcript or internal intermediate reasoning is archived. **Re-running prompts is not a reproducibility method** for this project. The checked-in files and tool versions constitute the reproducible software artefact.
- No third-party packages, external JavaScript, AI API calls or developer network services are required at runtime.

## Toolchain

- Firefox (for real-browser checks and installation).
- Node.js 18 or later (automated tests).
- Python 3.9 or later, with standard-library \`zipfile\` / \`zlib\` (submission ZIP).
- Optional Mozilla \`web-ext\` for further linting and extension development.

From the repository root:

\`\`\`sh
node --version
python --version
node tests/run-tests.cjs
python scripts/build_extension.py
\`\`\`

The tests use built-in Node.js modules and simulate the context menu, URL validation and WhereGoes form. These tests **do not** access the live WhereGoes website or validate Firefox compatibility. The build script uses fixed ZIP timestamps and sorted source members. ZIP bytes can vary across zlib versions, so source-level comparison is the reliable reproduction check.

## Manifest and package integrity

- Extension version: \`1.2.1\`.
- Manifest root: \`extension/manifest.json\`.
- Stable signing ID: \`send-to-wheregoes@thomasewoolley.github.io\`.
- Update manifest: \`https://thomaswoolley.co.uk/send-to-wheregoes/updates.json\`.
- ZIP produced: \`dist/send-to-wheregoes-1.2.1-unsigned.zip\`, with the seven extension files at the ZIP root.
- The ZIP is **not signed**. Do not redistribute it as though it were a Mozilla-approved permanent add-on.

## Manual acceptance tests still required

1. Load \`extension/manifest.json\` temporarily from Firefox \`about:debugging\`.
2. Right-click a harmless HTTPS hyperlink, select \`Trace link with WhereGoes\` and verify that WhereGoes receives the link and performs a trace.
3. Repeat with a URL pasted into the extension popup.
4. Visit WhereGoes normally and confirm the extension leaves the ordinary site untouched.
5. Verify unsafe URL schemes (\`javascript:\`, \`file:\`, \`data:\`) are rejected.
6. Confirm the privacy notice and update manifest both load over public HTTPS after activating GitHub Pages.
7. Submit the generated ZIP to the Mozilla Add-on Developer Hub as **unlisted**, review any validator messages and install the resulting Mozilla-signed XPI.

## Updating signed releases

Initially, \`docs/updates.json\` has an empty updates array. After Mozilla signs a *newer* version, host its signed \`.xpi\` in \`docs/\` and add an entry similar to:

\`\`\`json
{
  "addons": {
    "send-to-wheregoes@thomasewoolley.github.io": {
      "updates": [
        {
          "version": "1.2.2",
          "update_link": "https://thomaswoolley.co.uk/send-to-wheregoes/send-to-wheregoes-1.2.2.xpi"
        }
      ]
    }
  }
}
\`\`\`

Never point users to an unsigned XPI. Preserve the stable update URL and add-on ID: installed clients may otherwise lose the update path.

See [SETUP_NEW_REPOSITORY.md](SETUP_NEW_REPOSITORY.md) for one-time GitHub Pages activation.
