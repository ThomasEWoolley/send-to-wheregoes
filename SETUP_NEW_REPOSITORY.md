# One-time deployment and Mozilla signing

The project repository exists at <https://github.com/ThomasEWoolley/send-to-wheregoes>. It is deliberately separate from the owner's personal website repository.

## Activate GitHub Pages

1. Open <https://github.com/ThomasEWoolley/send-to-wheregoes/settings/pages>.
2. Under **Build and deployment**, select **Deploy from a branch**, branch **main**, folder **/docs** and click **Save**.
3. Wait for deployment. Consult the URL shown in the Pages settings and verify public HTTPS access to the expected files:
   - https://thomaswoolley.co.uk/send-to-wheregoes/updates.json
   - https://thomaswoolley.co.uk/send-to-wheregoes/privacy.html
4. The first URL must show JSON with the stable add-on ID and an empty \`updates\` array; the second should display the privacy notice. The custom domain of the account's user website can affect project-site routing; do not assume these URLs work until checked.

This GitHub connector can write source files but does not currently expose the repository administration action required to enable Pages. The owner must perform that one settings change.

## Sign with Mozilla

Run \`node tests/run-tests.cjs\` and \`python scripts/build_extension.py\`. Submit \`dist/send-to-wheregoes-1.2.1-unsigned.zip\` to <https://addons.mozilla.org/developers/> as an **unlisted extension**. Download the Mozilla-signed \`.xpi\` and install it using Firefox Add-ons Manager. A source ZIP is not a signed installation package.

## Publish later versions

After Mozilla signs a newer version, host the signed XPI in \`docs/\` and update \`docs/updates.json\` with its new version number and HTTPS download address. Do **not** serve unsigned XPI files as updates. Keep the same extension ID and update URL.

The original website repository has provisional old update and privacy files. Do not remove them until the new hosting is verified and any installed clients using that address have been accounted for.
