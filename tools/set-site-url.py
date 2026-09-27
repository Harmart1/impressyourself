#!/usr/bin/env python3
"""Replace the deployed base URL in public SEO metadata and sitemap files.
Usage: python tools/set-site-url.py https://example.com
"""
from pathlib import Path
import sys, re

if len(sys.argv) != 2:
    raise SystemExit("Usage: python tools/set-site-url.py https://example.com")
new = sys.argv[1].rstrip('/')
root = Path(__file__).resolve().parents[1] / 'site'
patterns = [
    r'https://harmart1\.github\.io/impressyourself',
    r'https://harmartim-oss\.github\.io/impressyourself',
    r'https://impressyourself\.harmartim\.chatgpt\.site',
]
changed = 0
for p in root.rglob('*'):
    if not p.is_file() or p.suffix.lower() not in {'.html','.xml','.txt','.css','.svg'}:
        continue
    try:
        text = p.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue
    updated = text
    for pat in patterns:
        updated = re.sub(pat, new, updated)
    if updated != text:
        p.write_text(updated, encoding='utf-8')
        changed += 1
print(f"Updated {changed} file(s) to {new}")
