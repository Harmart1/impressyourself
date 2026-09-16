#!/usr/bin/env python3
from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BASE = "https://harmart1.github.io/impressyourself"
STALE = (
    "harmartim-oss.github.io/impressyourself",
    "impressyourself.harmartim.chatgpt.site",
)

errors: list[str] = []
warnings: list[str] = []

required = [
    SITE / "index.html",
    SITE / "404.html",
    SITE / "robots.txt",
    SITE / "sitemap.xml",
    SITE / "impressyourself-butterfly-logo.svg",
    SITE / "social-preview.png",
]
for path in required:
    if not path.exists():
        errors.append(f"Missing required file: {path.relative_to(ROOT)}")

class Collector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs: list[tuple[str, str]] = []
        self.jsonld: list[str] = []
        self._in_jsonld = False
        self._buf: list[str] = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for key in ("href", "src"):
            if key in attrs:
                self.refs.append((key, attrs[key]))
        if tag == "script" and attrs.get("type", "").lower() == "application/ld+json":
            self._in_jsonld = True
            self._buf = []

    def handle_data(self, data):
        if self._in_jsonld:
            self._buf.append(data)

    def handle_endtag(self, tag):
        if tag == "script" and self._in_jsonld:
            self.jsonld.append("".join(self._buf).strip())
            self._in_jsonld = False
            self._buf = []


def resolve_local(html: Path, ref: str) -> Path | None:
    ref = ref.strip()
    if not ref or ref.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
        return None
    parts = urlsplit(ref)
    if parts.scheme in {"http", "https"} or parts.netloc:
        return None
    path = parts.path
    if not path:
        return None
    if path.startswith("/"):
        project_prefix = "/impressyourself/"
        if path.startswith(project_prefix):
            path = path[len(project_prefix):]
        else:
            path = path.lstrip("/")
        target = SITE / path
    else:
        target = html.parent / path
    if path.endswith("/"):
        target = target / "index.html"
    return target.resolve()

html_files = sorted(SITE.rglob("*.html"))
for html in html_files:
    text = html.read_text(encoding="utf-8")
    rel = html.relative_to(ROOT)
    for stale in STALE:
        if stale in text:
            errors.append(f"Stale domain reference in {rel}: {stale}")

    parser = Collector()
    parser.feed(text)

    for body in parser.jsonld:
        if not body:
            errors.append(f"Empty JSON-LD block in {rel}")
            continue
        try:
            json.loads(body)
        except json.JSONDecodeError as exc:
            errors.append(f"Invalid JSON-LD in {rel}: {exc}")

    for attr, ref in parser.refs:
        target = resolve_local(html, ref)
        if target is not None and not target.exists():
            errors.append(f"Broken local {attr} in {rel}: {ref}")

# Homepage canonical/base checks
index_text = (SITE / "index.html").read_text(encoding="utf-8") if (SITE / "index.html").exists() else ""
if f'<link rel="canonical" href="{BASE}/">' not in index_text:
    errors.append("Homepage canonical URL does not match Harmart1/impressyourself Pages URL")

# Sitemap parsing and URL checks
sitemap = SITE / "sitemap.xml"
if sitemap.exists():
    try:
        tree = ET.parse(sitemap)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locs = [n.text.strip() for n in tree.findall(".//sm:loc", ns) if n.text]
        if not locs:
            errors.append("sitemap.xml contains no <loc> entries")
        for loc in locs:
            if not loc.startswith(BASE + "/"):
                errors.append(f"Sitemap URL outside expected Pages base: {loc}")
    except ET.ParseError as exc:
        errors.append(f"Invalid sitemap.xml: {exc}")

robots = SITE / "robots.txt"
if robots.exists():
    rtext = robots.read_text(encoding="utf-8")
    if f"Sitemap: {BASE}/sitemap.xml" not in rtext:
        errors.append("robots.txt sitemap URL does not match expected Pages URL")

# Warn if booking endpoint is still unset; this is allowed for preview launch.
match = re.search(r'<meta\s+name="impressyourself-calendar-endpoint"\s+content="([^"]*)"', index_text)
if match and not match.group(1).strip():
    warnings.append("Google Calendar endpoint is not connected; booking calendar will remain in preview mode")

for w in warnings:
    print(f"WARNING: {w}")
if errors:
    for err in errors:
        print(f"ERROR: {err}", file=sys.stderr)
    print(f"Validation failed with {len(errors)} error(s).", file=sys.stderr)
    raise SystemExit(1)
print(f"Validation passed: {len(html_files)} HTML file(s), sitemap, SEO base URL and local links checked.")
