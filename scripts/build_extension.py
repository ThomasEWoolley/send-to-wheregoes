#!/usr/bin/env python3
"""Reproducible unsigned Firefox submission ZIP. Python 3.9+ stdlib only."""
from pathlib import Path
from hashlib import sha256
import json,zipfile

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'extension'
FILES=('manifest.json','background.js','wheregoes-fill.js','popup.html','popup.js','style.css','icon.svg')
manifest=json.loads((SOURCE/'manifest.json').read_text(encoding='utf-8'))
version=manifest['version']
expected='https://raw.githubusercontent.com/ThomasEWoolley/send-to-wheregoes/main/docs/updates.json'
assert manifest['browser_specific_settings']['gecko']['update_url']==expected
assert manifest['browser_specific_settings']['gecko']['id']=='send-to-wheregoes@thomasewoolley.github.io'
assert json.loads((ROOT/'docs'/'updates.json').read_text())['addons'].get(manifest['browser_specific_settings']['gecko']['id']) is not None
OUT=ROOT/'dist'/f'send-to-wheregoes-{version}-unsigned.zip'
OUT.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(OUT,'w') as out:
    for name in FILES:
        info=zipfile.ZipInfo(name,date_time=(2026,10,9,0,0,0))
        info.create_system=3
        info.external_attr=(0o100644 << 16)
        info.compress_type=zipfile.ZIP_DEFLATED
        out.writestr(info,(SOURCE/name).read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
with zipfile.ZipFile(OUT) as z:
    assert z.testzip() is None
    assert sorted(z.namelist())==sorted(FILES)
print(f'File: {OUT}')
print(f'SHA256: {sha256(OUT.read_bytes()).hexdigest()}')
print('Unsigned ZIP integrity: PASS')
